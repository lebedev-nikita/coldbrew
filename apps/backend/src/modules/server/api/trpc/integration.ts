import { DonationSourceSchema } from "@backend/schemas.js";
import { userStore } from "@backend/sensors/db/user.js";
import { z } from "zod";

import { authenticatedProcedure, router } from "./_config.js";

export const integrationRouter = router({
  disconnectDonationAlerts: authenticatedProcedure
    .input(
      z.object({
        source: DonationSourceSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.source == "donationalerts") {
        await userStore.disconnectDonationAlerts(ctx.userId);
      }
    }),
});
