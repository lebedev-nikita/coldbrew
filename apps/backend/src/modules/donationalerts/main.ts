import { isInstanceof } from "@backend/lib/isInstanceof.js";
import { UnauthorizedError } from "@backend/lib/neverthrow/fetchJson.js";
import { AccessToken, RefreshToken, UserId } from "@backend/schemas.js";
import { donationStore } from "@backend/sensors/db/donation.js";
import { userStore } from "@backend/sensors/db/user.js";
import { donationAlerts } from "@backend/sensors/donationalerts.js";
import delay from "delay";
import { err, ResultAsync } from "neverthrow";

function updateTokensInDb(userId: UserId, refreshToken: RefreshToken) {
  return donationAlerts
    .issueNewTokens(refreshToken)
    .andTee((tokens) =>
      ResultAsync.fromSafePromise(
        userStore.setTokens(userId, tokens.refreshToken, tokens.accessToken),
      ),
    );
}

function pullDonations(userId: UserId, accessToken: AccessToken, refreshToken: RefreshToken) {
  return donationAlerts.getDonations(accessToken).orElse((error) => {
    if (!isInstanceof(error, UnauthorizedError)) return err(error);

    return updateTokensInDb(userId, refreshToken).andThen((tokens) =>
      donationAlerts.getDonations(tokens.accessToken),
    );
  });
}

export async function main() {
  while (true) {
    for (const user of await userStore.getUsers()) {
      const { userId, accessToken, refreshToken } = user;
      if (!accessToken || !refreshToken) continue;

      await pullDonations(userId, accessToken, refreshToken).match(
        async (donations) => await donationStore.insertDonations(userId, donations),
        // TODO: handle errors
        () => {},
      );

      await delay(1000);
    }
  }
}
