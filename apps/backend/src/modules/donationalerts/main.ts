import { UnauthorizedError } from "@backend/lib/neverthrow/fetchJson.js";
import { donationStore } from "@backend/sensors/db/donation.js";
import { userStore } from "@backend/sensors/db/user.js";
import { donationAlerts } from "@backend/sensors/donationalerts.js";
import delay from "delay";
import { err, ResultAsync } from "neverthrow";

export async function main() {
  while (true) {
    for (const user of await userStore.getUsers()) {
      const { userId, accessToken, refreshToken } = user;
      if (!accessToken || !refreshToken) continue;

      await donationAlerts
        .getDonations(accessToken)
        .orElse((error) => {
          if (!(error instanceof UnauthorizedError)) return err(error);

          return donationAlerts
            .issueAccessToken(refreshToken)
            .andTee((tokens) =>
              ResultAsync.fromSafePromise(
                userStore.setTokens(userId, tokens.refreshToken, tokens.accessToken),
              ),
            )
            .andThen((tokens) => donationAlerts.getDonations(tokens.accessToken));
        })
        .match(
          async (donations) => await donationStore.insertDonations(userId, donations),
          // TODO: handle errors
          () => {},
        );

      await delay(1000);
    }
  }
}
