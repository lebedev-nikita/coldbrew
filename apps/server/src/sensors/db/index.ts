import { z } from "zod";
import type { UserId } from "../../schemas.js";
import { AccessToken, AccessTokenSchema, RefreshToken } from "../../schemas.js";
import { sql } from "./_config.js";

const UserInfoSchema = z.object({
  userId: z.number(),

  hasDonationalertsRefreshToken: z.boolean(),
  hasDonationalertsAccessToken: z.boolean(),
});

class UserStore {
  async createUser(userId: UserId) {
    const rows = await sql`
      INSERT INTO "user" ( user_id )
      VALUES             (${userId})
      RETURNING
        user_id,
        donationalerts_refresh_token IS NOT NULL  AS has_donationalerts_refresh_token,
        donationalerts_access_token  IS NOT NULL  AS has_donationalerts_access_token
    `;

    return UserInfoSchema.parse(rows[0]);
  }

  async getUserInfo(userId: UserId) {
    const rows = await sql`
      SELECT  user_id,
              donationalerts_refresh_token IS NOT NULL  AS has_donationalerts_refresh_token,
              donationalerts_access_token  IS NOT NULL  AS has_donationalerts_access_token
      FROM "user"
      WHERE user_id = ${userId}
    `;

    return UserInfoSchema.optional().parse(rows[0]) ?? null;
  }

  async setRefreshToken(userId: UserId, refreshToken: RefreshToken) {
    await sql`
      UPDATE "user"
      SET donationalerts_refresh_token = ${refreshToken}
      WHERE user_id = ${userId}
    `;
  }

  async getRefreshToken(userId: UserId) {
    const rows = await sql`
      SELECT donationalerts_refresh_token
      FROM "user"
    `;

    const schema = z.object({
      donationalertsRefreshToken: z.string().nullable(),
    });

    return schema.parse(rows[0])?.donationalertsRefreshToken;
  }

  async setAccessToken(userId: UserId, accessToken: AccessToken) {
    await sql`
      UPDATE "user"
      SET donationalerts_access_token = ${accessToken}
      WHERE user_id = ${userId}
    `;
  }

  async getAccessToken(userId: UserId) {
    const rows = await sql`
      SELECT donationalerts_access_token
      FROM "user"
    `;

    const schema = z.object({
      donationalertsAccessToken: AccessTokenSchema.nullable(),
    });

    return schema.parse(rows[0])?.donationalertsAccessToken;
  }
}

export const userStore = new UserStore();
