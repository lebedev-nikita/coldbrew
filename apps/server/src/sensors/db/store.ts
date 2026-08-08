import { jsonb } from "@omnistream/packages/jsonb.js";
import {
  AccessToken,
  AccessTokenSchema,
  AuthUserId,
  Donation,
  DonationSchema,
  RefreshToken,
  RefreshTokenSchema,
  UserId,
  UserIdSchema,
  UserInfoSchema,
} from "@omnistream/packages/schemas.js";
import postgres, { Sql } from "postgres";
import { z } from "zod";

export class Store {
  static fromDbUrl(dbUrl: string) {
    const sql = postgres(dbUrl, { transform: postgres.camel });
    return new Store(sql);
  }

  constructor(private readonly sql: Sql) {}

  async insertDonations(userId: UserId, donations: Donation[]) {
    const input = jsonb(this.sql, donations);

    const rows = await this.sql`
      WITH input AS (
        SELECT *
        FROM jsonb_to_recordset(${input}::jsonb) as t (donation_id int, donation_source donation_source, author text, message text, currency currency, amount float, created_at js_date)
      )
      INSERT INTO donation (donation_id, donation_source, user_id,   author, message, currency, amount, created_at)
      SELECT                donation_id, donation_source, ${userId}, author, message, currency, amount, created_at
      FROM input
      ON CONFLICT (donation_id, donation_source) DO NOTHING
      RETURNING *
    `;

    return z.array(DonationSchema).parse(rows);
  }

  async listDonations(userId: UserId) {
    const rows = await this.sql`
      SELECT *
      FROM donation
      WHERE user_id = ${userId}
    `;

    return z.array(DonationSchema).parse(rows);
  }

  async getOrCreateUserId(authUserId: AuthUserId) {
    const rows = await this.sql`
      INSERT INTO "user" (auth_user_id)
      VALUES             (${authUserId})
      ON CONFLICT (auth_user_id) DO UPDATE
      SET auth_user_id = EXCLUDED.auth_user_id
      RETURNING user_id
    `;

    return UserIdSchema.parse(rows[0]?.userId);
  }

  async getUsersAuthenticatedInDonationAlerts() {
    const rows = await this.sql`
      SELECT user_id,
        donationalerts_access_token   AS access_token,
        donationalerts_refresh_token  AS refresh_token
      FROM "user"
      WHERE donationalerts_access_token IS NOT NULL
        AND donationalerts_refresh_token IS NOT NULL
    `;

    const schema = z.object({
      userId: UserIdSchema,
      accessToken: AccessTokenSchema,
      refreshToken: RefreshTokenSchema,
    });

    return z.array(schema).parse(rows);
  }

  async getUserInfo(userId: UserId) {
    const rows = await this.sql`
      SELECT  user_id,
              donationalerts_refresh_token IS NOT NULL  AS has_donationalerts_refresh_token,
              donationalerts_access_token  IS NOT NULL  AS has_donationalerts_access_token
      FROM "user"
      WHERE user_id = ${userId}
    `;

    return UserInfoSchema.optional().parse(rows[0]) ?? null;
  }

  async setTokens(userId: UserId, refreshToken: RefreshToken, accessToken: AccessToken) {
    await this.sql`
      UPDATE "user" SET
        donationalerts_refresh_token = ${refreshToken},
        donationalerts_access_token = ${accessToken}
      WHERE user_id = ${userId}
    `;
  }

  async getAccessToken(userId: UserId) {
    const rows = await this.sql`
      SELECT donationalerts_access_token
      FROM "user"
      WHERE user_id = ${userId}
    `;

    const schema = z.object({
      donationalertsAccessToken: AccessTokenSchema.nullable(),
    });

    return schema.parse(rows[0])?.donationalertsAccessToken;
  }

  async getRefreshToken(userId: UserId) {
    const rows = await this.sql`
      SELECT donationalerts_refresh_token
      FROM "user"
      WHERE user_id = ${userId}
    `;

    const schema = z.object({
      donationalertsRefreshToken: RefreshTokenSchema.nullable(),
    });

    return schema.parse(rows[0])?.donationalertsRefreshToken;
  }

  async disconnectDonationAlerts(userId: UserId) {
    await this.sql`
      UPDATE "user" SET
        donationalerts_refresh_token = null,
        donationalerts_access_token = null
      WHERE user_id = ${userId}
    `;
  }
}
