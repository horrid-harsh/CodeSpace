import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(morgan("combined"));

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

export function getServiceProxy(sandboxId) {
  const target = `http://sandbox-service-${sandboxId}`;

  if (!serviceProxies[sandboxId]) {
    serviceProxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
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
      ws: true,
    });
  }
  return agentProxies[sandboxId];
}

app.use((req, res, next) => {
  const host = req.headers.host;
  const sandboxId = host?.split(".")[0];

  if (host.split(".")[1] === "agent") {
    return getAgentProxy(sandboxId)(req, res, next);
  } else if (host.split(".")[1] === "preview") {
    return getServiceProxy(sandboxId)(req, res, next);
  }
});

export default app;
