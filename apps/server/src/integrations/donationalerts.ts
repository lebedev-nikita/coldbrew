import dedent from "dedent-js";
import { z } from "zod";
import { env } from "../env.js";
import { UnauthorizedError, UnexpectedError } from "../errors.js";
import { JsonParseError, myfetch } from "../lib/myfetch.js";
import { Donation } from "../schemas.js";
import { AccessToken, AccessTokenSchema, RefreshToken, RefreshTokenSchema } from "../schemas.js";

class DonationAlerts {
  async getDonations(accessToken: AccessToken) {
    const res = await myfetch("https://www.donationalerts.com/api/v1/alerts/donations", {
      headers: { "Authorization": `Bearer ${accessToken}` },
    });
    if (res.status == 401) return new UnauthorizedError();

    const data = await res.json();
    if (data instanceof JsonParseError) return data;

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

    const parsed = schema.parse(data);

    return parsed.data.map(
      (donation): Donation => ({
        source: "donationalerts",
        amount: donation.amount,
        author: donation.username,
        currency: donation.currency,
        message: donation.message,
        createdAt: donation.created_at,
      }),
    );
  }

  // TODO: remove redirectUri?
  async getTokens(authCode: string, redirectUri: string) {
    const searchParams = new URLSearchParams({
      "grant_type": "authorization_code",
      "client_id": env.DONATION_ALERTS_CLIENT_ID,
      "client_secret": env.DONATION_ALERTS_CLIENT_SECRET,
      // not used for anything
      "redirect_uri": redirectUri,
      "code": authCode,
    });

    const res = await myfetch("https://www.donationalerts.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: searchParams.toString(),
    });

    if (!res.ok) {
      const data = await res.json();

      const info = {
        status: res.status,
        data: data instanceof Error ? data.message : data,
      };

      return new UnexpectedError(dedent`
        DonationAlerts token exchange failed:
        ${JSON.stringify(info, null, 2)}
      `);
    }

    const schema = z.object({
      "token_type": z.literal("Bearer"),
      "expires_in": z.number(),
      "access_token": AccessTokenSchema,
      "refresh_token": RefreshTokenSchema,
    });

    return schema.parse(await res.json());
  }

  async getAuthToken(refreshToken: RefreshToken) {}
}

export const donationAlerts = new DonationAlerts();
