import process from "node:process";

import "dotenv-expand/config";
import { z } from "zod";

export const env = getEnv();

function getEnv() {
  const EnvSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().default(3000),
    CLIENT_ORIGIN: z.string().nonempty().optional(),

    DONATION_ALERTS_CLIENT_ID: z.string().refine((str) => str.length > 0 && !isNaN(+str)),
    DONATION_ALERTS_CLIENT_SECRET: z.string().nonempty(),
  });

  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error(JSON.stringify(result.error.issues, null, 2));
    process.exit(1);
  }

  return result.data;
}
