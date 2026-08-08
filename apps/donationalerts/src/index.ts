import { delay } from "@omnistream/packages/delay.js";
import { isInstanceof } from "@omnistream/packages/isInstanceof.js";
import { UnauthorizedError } from "@omnistream/packages/neverthrow/fetch.js";
import { AccessToken, RefreshToken, UserId } from "@omnistream/packages/schemas.js";

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

  if ($donations.isErr()) {
    // TODO: handle error
    console.error($donations.error);
    return;
  }

  await store.insertDonations(userId, $donations.value);
}

async function main() {
  while (true) {
    await using _ = delay(2500);

    const users = await store.getUsersAuthenticatedInDonationAlerts();

    for (const user of users) {
      await syncUserDonations(user.userId, user.accessToken, user.refreshToken);
    }
  }
}

main();
