import { trpcServer } from "@hono/trpc-server";
import { readonlyUrl } from "@lebedevna/readonly-url";
import { Hono } from "hono";
import { UnexpectedError } from "../errors.js";
import { donationAlerts } from "../integrations/donationalerts.js";
import { userStore } from "../sensors/db/index.js";
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

    const tokens = await donationAlerts.getTokens(
      authCode,
      readonlyUrl(c.req.url).withSearch("").href,
    );

    if (tokens instanceof UnexpectedError) {
      return c.redirect(appUrl.withSearchParam("success", false).toString());
    }

    await userStore.setAccessToken(userId, tokens.access_token);
    await userStore.setRefreshToken(userId, tokens.refresh_token);

    return c.redirect(appUrl.withSearchParam("success", true).toString());
  });
