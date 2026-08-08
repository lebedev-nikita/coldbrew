import { readonlyUrl } from "@lebedevna/readonly-url";
import { DONATION_ALERTS_SCOPES } from "@omnistream/packages/donationalerts.js";

import { env } from "../../env.js";
import { store } from "../../sensors/db/index.js";
import { authenticatedProcedure, procedure, router } from "./_config.js";
import { integrationRouter } from "./integration.js";

export const appRouter = router({
  integration: integrationRouter,

  authUrls: authenticatedProcedure.query(() => {
    const donationAlerts = readonlyUrl("https://www.donationalerts.com/oauth/authorize")
      .withSearchParam("client_id", env.DONATION_ALERTS_CLIENT_ID)
      .withSearchParam(
        "redirect_uri",
        "http://localhost:3000/api/integration/donationalerts/callback",
      )
      .withSearchParam("response_type", "code")
      .withSearchParam("scope", DONATION_ALERTS_SCOPES)
      .toString();

    return { donationAlerts };
  }),

  userInfo: authenticatedProcedure.query(async ({ ctx }) => {
    return await store.getUserInfo(ctx.userId);
  }),

  donations: authenticatedProcedure.query(async ({ ctx }) => {
    return await store.listDonations(ctx.userId);
  }),
});

export type AppRouter = typeof appRouter;
