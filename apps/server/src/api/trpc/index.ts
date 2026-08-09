import { readonlyUrl } from "@lebedevna/readonly-url";
import { DONATION_ALERTS_SCOPES } from "@omnistream/packages/donationalerts.js";
import { SlugSchema, UserIdSchema } from "@omnistream/packages/schemas.js";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

  userInfo: procedure.query(async ({ ctx }) => {
    if (ctx.userId === null) return null;
    return await store.getUserInfo(ctx.userId);
  }),

  donations: authenticatedProcedure.query(async ({ ctx }) => {
    return await store.listDonations(ctx.userId);
  }),

  videos: authenticatedProcedure.query(async ({ ctx }) => {
    return await store.listVideos(ctx.userId);
  }),

  updateVideoStatus: authenticatedProcedure
    .input(
      z
        .object({
          videoId: z.number().int().positive(),
          watchedAt: z.date().nullable().optional(),
          savedAt: z.date().nullable().optional(),
        })
        .refine((input) => input.watchedAt !== undefined || input.savedAt !== undefined),
    )
    .mutation(async ({ ctx, input }) => {
      const wasUpdated = await store.updateVideoStatus(ctx.userId, input.videoId, input);

      if (!wasUpdated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Video not found." });
      }
    }),

  sharedVideos: procedure
    .input(
      z.object({
        slug: SlugSchema,
      }),
    )
    .query(async ({ input }) => {
      return await store.listSharedVideos(input.slug);
    }),

  updateSlug: authenticatedProcedure
    .input(
      z.object({
        slug: SlugSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const wasUpdated = await store.setSlug(ctx.userId, input.slug);

      if (!wasUpdated) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This slug is already in use.",
        });
      }

      return { slug: input.slug };
    }),
});

export type AppRouter = typeof appRouter;
