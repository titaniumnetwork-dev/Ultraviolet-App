import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";

// static paths
import { publicPath } from "ultraviolet-static";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

// Create Fastify instance without custom serverFactory
const fastify = Fastify();

// Allow all origins/methods/headers for CORS
fastify.register(fastifyCors, {
  origin: true,
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["*"],
  exposedHeaders: ["*"],
  credentials: false,
  maxAge: 86400,
  preflight: true,
  strictPreflight: false,
});

// Require token for all requests (except CORS preflight)
const REQUIRED_TOKEN = process.env.PROXY_TOKEN;
fastify.addHook("onRequest", (request, reply, done) => {
  if (request.method === "OPTIONS") return done();

  const authHeader = request.headers["authorization"];
  const isBearer = typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ");
  const bearerToken = isBearer ? authHeader.slice(7) : undefined;
  const headerToken = typeof request.headers["x-proxy-token"] === "string" ? request.headers["x-proxy-token"] : undefined;
  const queryToken = request.query && typeof request.query.token === "string" ? request.query.token : undefined;
  const providedToken = bearerToken || headerToken || queryToken;

  if (!REQUIRED_TOKEN || providedToken !== REQUIRED_TOKEN) {
    reply.code(401).header("www-authenticate", "Bearer").send({ error: "Unauthorized" });
    return;
  }

  done();
});

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
