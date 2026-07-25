import { z } from "zod";
import "dotenv/config";

export const env = getEnv();

function getEnv() {
  const EnvSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().default(3000),
    CLIENT_ORIGIN: z.string().nonempty().optional(),
  });

  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error(JSON.stringify(result.error.issues, null, 2));
    process.exit(1);
  }

  return result.data;
}
