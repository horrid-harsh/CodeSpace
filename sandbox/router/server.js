import app, { getServiceProxy, getAgentProxy } from "./src/app.js";

const PORT = 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Router is running at http://0.0.0.0:${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  const host = req.headers.host;
  const sandboxId = host?.split(".")[0];
  const subdomain = host?.split(".")[1];

  if (subdomain === "agent") {
    return getAgentProxy(sandboxId).upgrade(req, socket, head);
  } else if (subdomain === "preview") {
    return getServiceProxy(sandboxId).upgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});