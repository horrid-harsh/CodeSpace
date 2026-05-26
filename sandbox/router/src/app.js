import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import http from 'http';
import { createProxyServer } from 'httpxy';

const app = express();
app.use(morgan("combined"));

// Global CORS to prevent CORS errors during 502/504 proxy failures
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/api/status/healthz", (req, res) => {
  res.status(200).json({
    message: "Router is healthy",
    status: "success",
  });
});

app.get("/api/status/readyz", (req, res) => {
  res.status(200).json({
    message: "Router is ready",
    status: "success",
  });
});

const serviceProxies = {};
const agentProxies = {};

function getSandboxRoute(req) {
  const host = req.headers.host?.split(":")[0];
  const [sandboxIdFromHost, subdomain] = host?.split(".") ?? [];
  let sandboxId = sandboxIdFromHost;

  // Support extracting sandboxId from query params for Socket.IO
  // This bypasses browser restrictions on setting Host headers
  if (req.url?.includes("/socket.io")) {
    try {
      const urlParams = new URLSearchParams(req.url.split('?')[1]);
      const querySandboxId = urlParams.get('sandboxId');
      if (querySandboxId) {
        return { sandboxId: querySandboxId, type: "agent" };
      }
    } catch (e) {
      // Ignore URL parse errors
    }
  }

  if (subdomain === "agent" || subdomain === "preview") {
    return { sandboxId, type: subdomain };
  }

  if (req.url?.startsWith("/socket.io") && sandboxId) {
    // Fallback for localhost (where host is just 'localhost')
    if (sandboxId === 'localhost') return {};
    return { sandboxId, type: "agent" };
  }

  return {};
}

export function getServiceProxy(sandboxId) {
  const target = `http://sandbox-service-${sandboxId}`;

  if (!serviceProxies[sandboxId]) {
    serviceProxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      timeout: 0,
      proxyTimeout: 0,
    });
  }
  return serviceProxies[sandboxId];
}

export function getAgentProxy(sandboxId) {
  const target = `http://sandbox-service-${sandboxId}:3000`;

  if (!agentProxies[sandboxId]) {
    agentProxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      timeout: 0,
      proxyTimeout: 0,
    });
  }
  return agentProxies[sandboxId];
}

app.use((req, res, next) => {
  const { sandboxId, type } = getSandboxRoute(req);

  if (!sandboxId || !type) {
    return next();
  }

  if (type === "agent") {
    return getAgentProxy(sandboxId)(req, res, next);
  } else if (type === "preview") {
    return getServiceProxy(sandboxId)(req, res, next);
  }

  return next();
});

const server = http.createServer(app);

// Single httpxy proxy for all WebSocket upgrades
const wsProxy = createProxyServer({ changeOrigin: true });
wsProxy.on('error', (err, req, socket) => {
  console.error('WS proxy error:', err.message);
  socket?.destroy();
});

server.on("upgrade", (req, socket, head) => {
  const host = req.headers.host;
  const { sandboxId, type } = getSandboxRoute(req);

  console.log(`WS upgrade request: ${host}, sandboxId: ${sandboxId}, type: ${type}`);

  socket.on('error', () => socket.destroy());

  if (!sandboxId || !type) {
    socket.destroy();
  } else if (type === "agent") {
    wsProxy.ws(req, socket, { target: `http://sandbox-service-${sandboxId}:3000` }, head)
      .catch(() => socket.destroy());
  } else if (type === "preview") {
    wsProxy.ws(req, socket, { target: `http://sandbox-service-${sandboxId}` }, head)
      .catch(() => socket.destroy());
  } else {
    console.error(`Unknown type: ${type}`);
    socket.destroy();
  }
});

export default server;
