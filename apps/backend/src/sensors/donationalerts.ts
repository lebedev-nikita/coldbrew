import { env } from "@backend/env.js";
import { fetchJson } from "@backend/lib/neverthrow/fetchJson.js";
import {
  AccessToken,
  AccessTokenSchema,
  Donation,
  RefreshToken,
  RefreshTokenSchema,
} from "@backend/schemas.js";
import { err, ok } from "neverthrow";
import { z } from "zod";

export const DONATION_ALERTS_SCOPES = [
  "oauth-user-show",
  "oauth-donation-subscribe",
  "oauth-donation-index",
  "oauth-custom_alert-store",
  "oauth-goal-subscribe",
  "oauth-poll-subscribe",
].join(" ");

class DonationAlerts {
  getDonations(accessToken: AccessToken) {
    const ResDonationSchema = z.object({
      id: z.number(),
      name: z.string(),
      username: z.string().nullable(),
      message_type: z.string(),
      message: z.string().nullable(),
      amount: z.number(),
      // TODO
      currency: z.enum(["RUB"]),
      is_shown: z.number(),
      created_at: z.coerce.date(),
      shown_at: z.string().nullable(),
    });

    const schema = z.object({
      data: z.array(ResDonationSchema),
      meta: z.object({
        last_page: z.number().int().positive(),
        total: z.number().int().nonnegative(),
      }),
    });

    return fetchJson("https://www.donationalerts.com/api/v1/alerts/donations", {
      headers: { "Authorization": `Bearer ${accessToken}` },
    }).andThen((data) => {
      const parsed = schema.safeParse(data);
      if (!parsed.success) return err(parsed.error);

      return ok(
        parsed.data.data.map(
          (donation): Donation => ({
            donationId: donation.id,
            source: "donationalerts",
            amount: donation.amount,
            author: donation.username,
            currency: donation.currency,
            message: donation.message,
            createdAt: donation.created_at,
          }),
        ),
      );
    });
  }

  // TODO: remove redirectUri?
  getTokens(authCode: string, redirectUri: string) {
    const searchParams = new URLSearchParams({
      "grant_type": "authorization_code",
      "client_id": env.DONATION_ALERTS_CLIENT_ID,
      "client_secret": env.DONATION_ALERTS_CLIENT_SECRET,
      // not used for anything
      "redirect_uri": redirectUri,
      "code": authCode,
    });

    const schema = z.object({
      "token_type": z.literal("Bearer"),
      "expires_in": z.number(),
      "access_token": AccessTokenSchema,
      "refresh_token": RefreshTokenSchema,
    });

    return fetchJson("https://www.donationalerts.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: searchParams.toString(),
    }).andThen((data) => {
      const parsed = schema.safeParse(data);
      if (!parsed.success) return err(parsed.error);

      return ok({
        accessToken: parsed.data.access_token,
        refreshToken: parsed.data.refresh_token,
      });
    });
  }

  issueAccessToken(refreshToken: RefreshToken) {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: env.DONATION_ALERTS_CLIENT_ID,
      client_secret: env.DONATION_ALERTS_CLIENT_SECRET,
      scope: DONATION_ALERTS_SCOPES,
    });

    const schema = z.object({
      "token_type": z.literal("Bearer"),
      "expires_in": z.number(),
      "access_token": AccessTokenSchema,
      "refresh_token": RefreshTokenSchema,
    });

    return fetchJson("https://www.donationalerts.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }).andThen((data) => {
      const result = schema.safeParse(data);
      if (!result.success) return err(result.error);

      return ok({
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token,
      });
    });
  }
}

export const donationAlerts = new DonationAlerts();
