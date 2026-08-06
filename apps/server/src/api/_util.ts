import { UserId, UserIdSchema } from "@omnistream/packages/schemas.js";

export function getUserId(req: Request): UserId | null {
  return UserIdSchema.parse(1);
}
