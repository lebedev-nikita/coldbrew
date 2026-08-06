import { createTaggedError } from "errore";
import { err, ok } from "neverthrow";
import { ZodError, ZodType } from "zod";

class ValidationError extends createTaggedError({
  name: "ValidationError",
  extends: ZodError,
}) {}

export function validate<T>(schema: ZodType<T>, value: unknown) {
  const res = schema.safeParse(value);
  return res.success ? ok(res.data) : err(new ValidationError(res.error));
}
