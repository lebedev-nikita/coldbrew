import { env } from "../../env.js";
import { Store } from "./store.js";

export const store = new Store(env.DATABASE_URL);
