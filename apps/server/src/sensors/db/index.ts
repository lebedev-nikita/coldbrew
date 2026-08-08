import postgres from "postgres";

import { env } from "../../env.js";
import { Store } from "./store.js";

export const sql = postgres(env.DATABASE_URL, { transform: postgres.camel });
export const store = new Store(sql);
