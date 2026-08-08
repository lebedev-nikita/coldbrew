import { Donation, DonationSchema } from "@omnistream/packages/schemas.js";
import postgres, { Sql } from "postgres";
import { z } from "zod";

type VideoToSave = {
  durationSeconds: number | null;
  url: string;
};

export class Store {
  static fromDbUrl(dbUrl: string) {
    return new Store(postgres(dbUrl, { transform: postgres.camel }));
  }

  constructor(private readonly sql: Sql) {}

  async getUnparsedDonations(limit = 100) {
    const rows = await this.sql`
      SELECT *
      FROM donation
      WHERE videos_parsed_at IS NULL
      ORDER BY created_at ASC
      LIMIT ${limit}
    `;

    return z.array(DonationSchema).parse(rows);
  }

  async saveVideos(donation: Donation, videos: VideoToSave[]) {
    await this.sql.begin(async (sql) => {
      if (videos.length > 0) {
        const urls = videos.map((video) => video.url);
        const durations = videos.map((video) => video.durationSeconds);

        await sql`
          INSERT INTO video (donation_id, url, duration_seconds)
          SELECT ${donation.donationId}, url, duration_seconds
          FROM unnest(${urls}::text[], ${durations}::int[]) AS video(url, duration_seconds)
          ON CONFLICT (donation_id, url) DO NOTHING
        `;
      }

      await sql`
        UPDATE donation
        SET videos_parsed_at = now()
        WHERE donation_id = ${donation.donationId}
      `;
    });
  }
}
