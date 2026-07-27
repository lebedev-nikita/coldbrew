import { env } from "@backend/env.js";
import postgres from "postgres";

export const sql = postgres(env.DATABASE_URL, {
  transform: postgres.camel,
});
