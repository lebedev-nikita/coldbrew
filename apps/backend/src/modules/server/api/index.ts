import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";

import { integrationRouter } from "./integration.js";
import { createContext } from "./trpc/_config.js";
import { appRouter } from "./trpc/index.js";

export const apiRouter = new Hono()
  .use("/trpc/*", trpcServer({ router: appRouter, createContext }))
  .route("/integration", integrationRouter);
