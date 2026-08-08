import { delay } from "@omnistream/packages/delay.js";

import { store } from "./sensors/db/index.js";
import { findYoutubeUrls, getYoutubeDurationSeconds } from "./youtube.js";

async function main() {
  while (true) {
    await using _ = delay(1000);

    const donations = await store.getUnparsedDonations();

    for (const donation of donations) {
      const urls = findYoutubeUrls(donation.message);
      const videos = await Promise.all(
        urls.map(async (url) => ({
          url,
          durationSeconds: (await getYoutubeDurationSeconds(url)).unwrapOr(null),
        })),
      );

      await store.saveVideos(donation, videos);
    }
  }
}

main();
