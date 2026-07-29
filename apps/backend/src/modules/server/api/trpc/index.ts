import { env } from "@backend/env.js";
import { donationStore } from "@backend/sensors/db/donation.js";
import { userStore } from "@backend/sensors/db/user.js";
import { DONATION_ALERTS_SCOPES } from "@backend/sensors/donationalerts.js";
import { readonlyUrl } from "@lebedevna/readonly-url";

import { authenticatedProcedure, procedure, router } from "./_config.js";
import { integrationRouter } from "./integration.js";

export const appRouter = router({
  integration: integrationRouter,

  authUrls: procedure.query(() => {
    const REDIRECT_URI = "http://localhost:3000/api/integration/donationalerts/callback";

    const donationAlerts = readonlyUrl(
      "https://www.donationalerts.com/oauth/authorize",
    ).withSearchParams({
      "client_id": env.DONATION_ALERTS_CLIENT_ID,
      "redirect_uri": REDIRECT_URI,
      "response_type": "code",
      "scope": DONATION_ALERTS_SCOPES,
    }).href;

    return { donationAlerts };
  }),

  userInfo: procedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null;

    const user = await userStore.getUserInfo(ctx.userId);
    if (user) return user;

    // TODO: better auth
    const createdUser = await userStore.createUser(ctx.userId);
    return createdUser;
  }),

  donations: authenticatedProcedure.query(async ({ ctx }) => {
    return await donationStore.listDonations(ctx.userId);
  }),
});

export type AppRouter = typeof appRouter;
