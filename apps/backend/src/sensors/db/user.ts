import {
  type UserId,
  AccessToken,
  AccessTokenSchema,
  RefreshToken,
  RefreshTokenSchema,
  UserIdSchema,
  UserInfoSchema,
} from "@backend/schemas.js";
import { z } from "zod";

import { sql } from "./_config.js";

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

  async getUsers() {
    const rows = await sql`
      SELECT user_id,
        donationalerts_access_token   AS access_token,
        donationalerts_refresh_token  AS refresh_token
      FROM "user"
    `;

    const schema = z.object({
      userId: UserIdSchema,
      accessToken: AccessTokenSchema.nullable(),
      refreshToken: RefreshTokenSchema.nullable(),
    });

    return z.array(schema).parse(rows);
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

  async setTokens(userId: UserId, refreshToken: RefreshToken, accessToken: AccessToken) {
    await sql`
      UPDATE "user" SET
        donationalerts_refresh_token = ${refreshToken},
        donationalerts_access_token = ${accessToken}
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

  async getRefreshToken(userId: UserId) {
    const rows = await sql`
      SELECT donationalerts_refresh_token
      FROM "user"
      WHERE user_id = ${userId}
    `;

    const schema = z.object({
      donationalertsRefreshToken: RefreshTokenSchema.nullable(),
    });

    return schema.parse(rows[0])?.donationalertsRefreshToken;
  }
}

export const userStore = new UserStore();
