import { createTaggedError } from "errore";
import { err, ok } from "neverthrow";

export class JsonParseError extends createTaggedError({
  name: "JsonParseError",
  message: "Invalid JSON:\n$source",
}) {}

export function parseJson(source: string) {
  try {
    return ok(JSON.parse(source) as unknown);
  } catch (error) {
    return err(new JsonParseError({ source }));
  }
}
