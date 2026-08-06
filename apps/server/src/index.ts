import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { apiRouter } from "./api/index.js";
import { env } from "./env.js";

export async function main() {
  const port = env.PORT;
  const app = new Hono();

  app.use("*", cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.route("/api", apiRouter);

  serve({ fetch: app.fetch, port });
  console.log(`Server listening on http://localhost:${port}`);
}

main();
