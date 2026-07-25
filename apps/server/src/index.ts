import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "./env.js";
import { apiRouter } from "./api/index.js";

const port = env.PORT;
const app = new Hono();

app.use("*", cors({ origin: env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.route("/api", apiRouter);

serve({ fetch: app.fetch, port });
console.log(`Server listening on http://localhost:${port}`);
