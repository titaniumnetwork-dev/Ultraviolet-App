import createServer from "@tomphttp/bare-server-node";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import http from "http";
import serveStatic from "serve-static";

const bare = createServer("/bare/");
const serve = serveStatic(
  join(dirname(fileURLToPath(import.meta.url)), "static/"),
  { fallthrough: false }
);

const server = http.createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    serve(req, res, (err) => {
      res.writeHead(err?.statusCode || 500, null, {
        "Content-Type": "text/plain",
      });
      res.end(err?.stack);
    });
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req, socket, head)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen({
  port: process.env.PORT || 8080,
});
