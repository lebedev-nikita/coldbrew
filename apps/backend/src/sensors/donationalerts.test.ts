import { UserIdSchema } from "@backend/schemas.js";
import { userStore } from "@backend/sensors/db/user.js";
import { assert, describe, expect, it } from "vitest";

import { donationAlerts } from "./donationalerts.js";

describe("DonationAlerts", () => {
  describe("issueAccessToken", () => {
    it("works", async () => {
      const userId = UserIdSchema.parse(1);

      const oldAccessToken = await userStore.getAccessToken(userId);
      const refreshToken = await userStore.getRefreshToken(userId);
      assert(refreshToken);

      const res = (await donationAlerts.issueAccessToken(refreshToken))._unsafeUnwrap();

      expect(res.refreshToken).not.toBe(refreshToken);
      expect(res.accessToken).not.toBe(oldAccessToken);

      await userStore.setTokens(userId, res.refreshToken, res.accessToken);
    });
  });
});
