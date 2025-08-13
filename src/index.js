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
  origin: (origin, cb) => {
    cb(null, true);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["*"],
  exposedHeaders: ["*"],
  credentials: false,
  maxAge: 86400,
  preflight: true,
  strictPreflight: false,
  hook: "preHandler",
});

// Ensure CORS headers are present on all responses (including static)
fastify.addHook("onSend", (req, reply, payload, done) => {
  const requestOrigin = req.headers.origin || "*";
  if (!reply.getHeader("Access-Control-Allow-Origin")) {
    reply.header("Access-Control-Allow-Origin", requestOrigin);
    reply.header("Vary", "Origin");
  }
  done();
});

// Attach Wisp upgrade handler for WebSocket connections
fastify.server.on("upgrade", (req, socket, head) => {
  try {
    const url = req.url || "";
    if (url.startsWith("/wisp")) {
      wisp.routeRequest(req, socket, head);
      return;
    }
  } catch (err) {
    try { socket.destroy(); } catch {}
  }
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

// Start a local server when not running on Vercel
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
  const port = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";
  fastify
    .listen({ port, host })
    .then(() => {
      console.log(`Local server listening. Open http://localhost:${port}`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

// Export the Vercel handler
export default async function handler(req, res) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}