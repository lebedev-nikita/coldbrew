import { z } from "zod";

export function getEnv<T extends z.core.$ZodLooseShape>(shape: T) {
  const result = z.object(shape).safeParse(process.env);

  if (!result.success) {
    console.error(JSON.stringify(result.error.issues, null, 2));
    process.exit(1);
  }

  return result.data;
}
