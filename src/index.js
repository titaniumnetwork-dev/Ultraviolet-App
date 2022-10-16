import createBareServer from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "node:http";
import { publicPath } from "ultraviolet-static";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";

const bare = createBareServer("/bare/");
const app = express();

// Load our publicPath first and prioritize it over UV.
app.use(express.static(publicPath));
// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
app.use("/uv/", express.static(uvPath));

const server = createServer();

server.on("request", (req, res) => app(req, res));

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
