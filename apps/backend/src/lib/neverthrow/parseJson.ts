import dedent from "dedent-js";
import { err, ok } from "neverthrow";

export class JsonParseError extends Error {
  constructor(source: string) {
    super(dedent`
      Invalid JSON:
      ${source}
    `);
  }
}

export function parseJson(source: string) {
  try {
    return ok(JSON.parse(source) as unknown);
  } catch (error) {
    return err(new JsonParseError(source));
  }
}
