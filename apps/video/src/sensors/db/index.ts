import { env } from "../../env.js";
import { Store } from "./store.js";

export const store = Store.fromDbUrl(env.DATABASE_URL);
