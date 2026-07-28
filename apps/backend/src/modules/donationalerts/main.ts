import { isInstanceof } from "@backend/lib/isInstanceof.js";
import { UnauthorizedError } from "@backend/lib/neverthrow/fetchJson.js";
import { AccessToken, RefreshToken, UserId } from "@backend/schemas.js";
import { donationStore } from "@backend/sensors/db/donation.js";
import { userStore } from "@backend/sensors/db/user.js";
import { donationAlerts } from "@backend/sensors/donationalerts.js";
import delay from "delay";

async function syncUserDonations(
  userId: UserId,
  accessToken: AccessToken,
  refreshToken: RefreshToken,
) {
  let $donations = await donationAlerts.getDonations(accessToken);

  if ($donations.isErr() && isInstanceof($donations.error, UnauthorizedError)) {
    const $tokens = await donationAlerts.refreshTokens(refreshToken);
    if ($tokens.isOk()) {
      await userStore.setTokens(userId, $tokens.value.refreshToken, $tokens.value.accessToken);
      $donations = await donationAlerts.getDonations($tokens.value.accessToken);
    }
  }

  const inserted = await $donations.match(
    (donations) => donationStore.insertDonations(userId, donations),
    () => "TODO: handle errors",
  );
}

export async function main() {
  while (true) {
    const users = await userStore.getUsersAuthenticatedInDonationAlerts();

    for (const user of users) {
      await syncUserDonations(user.userId, user.accessToken, user.refreshToken);

      await delay(1000);
    }
  }
}
