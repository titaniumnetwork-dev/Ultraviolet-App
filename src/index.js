import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

// static paths
import { publicPath } from "ultraviolet-static";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

// Create Fastify instance without custom serverFactory
const fastify = Fastify();

fastify.register(fastifyStatic, {
  root: publicPath,
  decorateReply: true,
});

fastify.get("/uv/uv.config.js", (req, res) => {
  return res.sendFile("uv/uv.config.js", publicPath);
});

fastify.register(fastifyStatic, {
  root: uvPath,
  prefix: "/uv/",
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: epoxyPath,
  prefix: "/epoxy/",
  decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: baremuxPath,
  prefix: "/baremux/",
  decorateReply: false,
});

// Export the Vercel handler
export default async function handler(req, res) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}
