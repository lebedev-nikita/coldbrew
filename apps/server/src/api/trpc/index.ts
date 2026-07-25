import { readonlyUrl } from "@lebedevna/readonly-url";
import { donationAlerts } from "../../integrations/donationalerts.js";
import { sql } from "../../sensors/db/_config.js";
import { userStore } from "../../sensors/db/index.js";
import { authenticatedProcedure, procedure, router } from "./_config.js";
import { UnauthorizedError } from "../../errors.js";

export const appRouter = router({
  health: procedure.query(async ({ ctx }) => {
    const rows = await sql`SELECT now()`;
    return { ok: true, databaseTime: rows[0].now.toISOString() };
  }),

  meta: procedure.query(() => {
    const DONATION_ALERTS_APP_ID = "20116";
    const REDIRECT_URI = "http://localhost:3000/api/success";

    const SCOPES = [
      "oauth-user-show",
      "oauth-donation-subscribe",
      "oauth-donation-index",
      "oauth-custom_alert-store",
      "oauth-goal-subscribe",
      "oauth-poll-subscribe",
    ];

    const authUrl = readonlyUrl("https://www.donationalerts.com/oauth/authorize").withSearchParams({
      "client_id": DONATION_ALERTS_APP_ID,
      "redirect_uri": REDIRECT_URI,
      "response_type": "code",
      "scope": SCOPES.join(" "),
    }).href;

    return { authUrl };
  }),

  userInfo: procedure.query(async ({ ctx }) => {
    if (!ctx.userId) return false;

    const user = await userStore.getUserInfo(ctx.userId);
    if (user) return user;

    const createdUser = await userStore.createUser(ctx.userId);
    return createdUser;
  }),

  donations: authenticatedProcedure.query(async ({ ctx }) => {
    const token = await userStore.getAccessToken(ctx.userId);
    if (!token) throw new Error("access token not found");

    const result = await donationAlerts.getDonations(token);
    // TODO
    if (result instanceof Error) return [];

    return result;
  }),
});

export type AppRouter = typeof appRouter;
