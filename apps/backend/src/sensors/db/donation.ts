import { Donation, DonationSchema, UserId } from "@backend/schemas.js";
import { z } from "zod";

import { sql } from "./_config.js";
import { jsonb } from "./_util.js";

class DonationStore {
  async insertDonations(userId: UserId, donations: Donation[]) {
    const input = jsonb(donations);

    const rows = await sql`
      WITH input AS (
        SELECT *
        FROM jsonb_to_recordset(${input}::jsonb) as t (donation_id int, source donation_source, author text, message text, currency currency, amount float, created_at js_date)
      )
      INSERT INTO donation (donation_id, source, user_id,   author, message, currency, amount, created_at)
      SELECT                donation_id, source, ${userId}, author, message, currency, amount, created_at
      FROM input
      ON CONFLICT (donation_id, source) DO NOTHING
      RETURNING *
    `;

    return z.array(DonationSchema).parse(rows);
  }

  async listDonations(userId: UserId) {
    const rows = await sql`
      SELECT *
      FROM donation
      WHERE user_id = ${userId}
    `;

    return z.array(DonationSchema).parse(rows);
  }
}

export const donationStore = new DonationStore();
