import { isInstanceof } from "@omnistream/packages/isInstanceof.js";
import { UnauthorizedError } from "@omnistream/packages/neverthrow/fetchJson.js";
import { AccessToken, RefreshToken, UserId } from "@omnistream/packages/schemas.js";
import delay from "delay";

import { store } from "./sensors/db/index.js";
import { donationAlerts } from "./sensors/donationalerts.js";

async function syncUserDonations(
  userId: UserId,
  accessToken: AccessToken,
  refreshToken: RefreshToken,
) {
  let $donations = await donationAlerts.getDonations(accessToken);

  if ($donations.isErr() && isInstanceof($donations.error, UnauthorizedError)) {
    const $tokens = await donationAlerts.refreshTokens(refreshToken);
    if ($tokens.isOk()) {
      await store.setTokens(userId, $tokens.value.refreshToken, $tokens.value.accessToken);
      $donations = await donationAlerts.getDonations($tokens.value.accessToken);
    }
  }

  const inserted = await $donations.match(
    (donations) => store.insertDonations(userId, donations),
    () => "TODO: handle errors",
  );
}

async function main() {
  while (true) {
    const users = await store.getUsersAuthenticatedInDonationAlerts();

    for (const user of users) {
      await syncUserDonations(user.userId, user.accessToken, user.refreshToken);

      await delay(2500);
    }

    await delay(1000);
  }
}

main();
