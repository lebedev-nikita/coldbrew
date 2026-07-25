import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { appRouter } from "./trpc.js";

export const apiRouter = new Hono().use("/trpc/*", trpcServer({ router: appRouter }));
