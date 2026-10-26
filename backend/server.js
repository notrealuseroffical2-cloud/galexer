import { createServer } from "node:http";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

const port = Number(process.env.PORT || 8080);
logging.set_level(logging.NONE);

// This is the transport endpoint for Galexer's static GitHub Pages frontend.
// Restrict this deployment to intended use; public proxy relays can be abused.
Object.assign(wisp.options, {
  allow_udp_streams: false,
  dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const server = createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json", "access-control-allow-origin": "*" });
    res.end(JSON.stringify({ ok: true, service: "galexer-scramjet-wisp" }));
    return;
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Wisp WebSocket transport is available at /wisp/");
});

server.on("upgrade", (req, socket, head) => {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;
  if (pathname === "/wisp/") {
    wisp.routeRequest(req, socket, head);
    return;
  }
  socket.destroy();
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Galexer Wisp backend listening on port ${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
