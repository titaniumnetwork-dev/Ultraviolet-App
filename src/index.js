import createBareServer from "@tomphttp/bare-server-node";
import { createServer } from "node:http";
import serveStatic from "serve-static";
import { publicPath } from "ultraviolet-static";

const bare = createBareServer("/bare/");
const serve = serveStatic(publicPath, { fallthrough: false });
const server = createServer();

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

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();

  console.log(
    `Listening on http://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

server.listen({
  port,
});
