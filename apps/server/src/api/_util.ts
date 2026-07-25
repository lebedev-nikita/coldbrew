import { UserId, UserIdSchema } from "../schemas.js";

export function getUserId(req: Request): UserId | null {
  return UserIdSchema.parse(1);
}
