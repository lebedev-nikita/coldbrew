import snakecaseKeys from "snakecase-keys";

import { sql } from "./_config.js";

export function jsonb(data: unknown[]) {
  return sql.json(data.map((elem) => snakecaseKeys(elem as any, { deep: false })));
}
