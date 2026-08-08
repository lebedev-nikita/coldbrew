import { DonationAlerts } from "@omnistream/packages/donationalerts.js";
import { getEnv } from "@omnistream/packages/getenv.js";
import { UserIdSchema } from "@omnistream/packages/schemas.js";
import { assert, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import { Store } from "./db/store.js";

describe("DonationAlerts", { tags: ["integration"] }, () => {
  let store: Store;
  let donationAlerts: DonationAlerts;

  beforeAll(async () => {
    const env = getEnv({
      DATABASE_URL: z.url(),
      DONATION_ALERTS_CLIENT_ID: z.string().nonempty(),
      DONATION_ALERTS_CLIENT_SECRET: z.string().nonempty(),
    });

    donationAlerts = new DonationAlerts({
      clientId: env.DONATION_ALERTS_CLIENT_ID,
      clientSecret: env.DONATION_ALERTS_CLIENT_SECRET,
    });
    store = Store.fromDbUrl(env.DATABASE_URL);
  });

  describe("issueAccessToken", () => {
    it("works", async () => {
      const userId = UserIdSchema.parse(1);

      const oldAccessToken = await store.getAccessToken(userId);
      const oldRefreshToken = await store.getRefreshToken(userId);
      assert(oldRefreshToken);

      const res = (await donationAlerts.refreshTokens(oldRefreshToken))._unsafeUnwrap();

      expect(res.refreshToken).not.toBe(oldRefreshToken);
      expect(res.accessToken).not.toBe(oldAccessToken);

      await store.setTokens(userId, res.refreshToken, res.accessToken);
    });
  });
});
