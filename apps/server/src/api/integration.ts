import { readonlyUrl } from "@lebedevna/readonly-url";
import { Hono } from "hono";

import { store } from "../sensors/db/index.js";
import { donationAlerts } from "../sensors/donationalerts.js";
import { getUserId } from "./_util.js";

export const integrationRouter = new Hono().get("/donationalerts/callback", async (c) => {
  const authCode = c.req.query("code");
  if (!authCode) return c.text("no auth code", 400);

  const userId = await getUserId(c.req.raw);
  if (!userId) return c.text("Unauthorized", 401);

  const appUrl = readonlyUrl("http://localhost:5173/integrations");

  return await donationAlerts
    .issueTokens(authCode, readonlyUrl(c.req.url).withSearch("").href)
    .match(
      async (tokens) => {
        await store.setTokens(userId, tokens.refreshToken, tokens.accessToken);
        return c.redirect(appUrl.withSearchParam("success", true).href);
      },
      async () => {
        return c.redirect(appUrl.withSearchParam("success", false).href);
      },
    );
});
