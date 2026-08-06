import { Sql } from "postgres";
import snakecaseKeys from "snakecase-keys";

export function jsonb(sql: Sql, data: unknown[]) {
  return sql.json(data.map((elem) => snakecaseKeys(elem as any, { deep: false })));
}
