import { userStore } from "@backend/sensors/db/user.js";
import { donationAlerts } from "@backend/sensors/donationalerts.js";
import { trpcServer } from "@hono/trpc-server";
import { readonlyUrl } from "@lebedevna/readonly-url";
import { Hono } from "hono";

import { getUserId } from "./_util.js";
import { createContext } from "./trpc/_config.js";
import { appRouter } from "./trpc/index.js";

export const apiRouter = new Hono()
  .use("/trpc/*", trpcServer({ router: appRouter, createContext }))
  .get("/success", async (c) => {
    const authCode = c.req.query("code");
    if (!authCode) return c.text("no auth code", 400);

    const userId = getUserId(c.req.raw);
    if (!userId) return c.text("Unauthorized", 401);

    const appUrl = readonlyUrl("http://localhost:5173/");

    return await donationAlerts
      .getTokens(authCode, readonlyUrl(c.req.url).withSearch("").href)
      .match(
        async (tokens) => {
          await userStore.setTokens(userId, tokens.refreshToken, tokens.accessToken);
          return c.redirect(appUrl.withSearchParam("success", true).href);
        },
        async () => {
          return c.redirect(appUrl.withSearchParam("success", false).href);
        },
      );
  });
