import { env } from "@backend/env.js";
import { sql } from "@backend/sensors/db/_config.js";
import { donationStore } from "@backend/sensors/db/donation.js";
import { userStore } from "@backend/sensors/db/user.js";
import { DONATION_ALERTS_SCOPES } from "@backend/sensors/donationalerts.js";
import { readonlyUrl } from "@lebedevna/readonly-url";

import { authenticatedProcedure, procedure, router } from "./_config.js";

export const appRouter = router({
  health: procedure.query(async ({ ctx }) => {
    const rows = await sql`SELECT now()`;
    return { ok: true, databaseTime: rows[0].now.toISOString() };
  }),

  meta: procedure.query(() => {
    const REDIRECT_URI = "http://localhost:3000/api/success";

    const authUrl = readonlyUrl("https://www.donationalerts.com/oauth/authorize").withSearchParams({
      "client_id": env.DONATION_ALERTS_CLIENT_ID,
      "redirect_uri": REDIRECT_URI,
      "response_type": "code",
      "scope": DONATION_ALERTS_SCOPES,
    }).href;

    return { authUrl };
  }),

  userInfo: procedure.query(async ({ ctx }) => {
    if (!ctx.userId) return false;

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
