import app, { getServiceProxy, getAgentProxy } from "./src/app.js";

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Router is running at http://localhost:${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  const host = req.headers.host;
  const sandboxId = host?.split(".")[0];

  if (host?.split(".")[1] === "agent") {
    return getAgentProxy(sandboxId).upgrade(req, socket, head);
  } else if (host?.split(".")[1] === "preview") {
    return getServiceProxy(sandboxId).upgrade(req, socket, head);
  }
});