import { getEnv } from "@omnistream/packages/getenv.js";
import { z } from "zod";

export const env = getEnv({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.string().nonempty().default("http://localhost:5173"),

  DONATION_ALERTS_CLIENT_ID: z.string().refine((str) => str.length > 0 && !isNaN(+str)),
  DONATION_ALERTS_CLIENT_SECRET: z.string().nonempty(),
});
