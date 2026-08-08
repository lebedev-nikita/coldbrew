import { AuthUserIdSchema, UserId } from "@omnistream/packages/schemas.js";

import { auth } from "../lib/auth.js";
import { store } from "../sensors/db/index.js";

export async function getUserId(req: Request): Promise<UserId | null> {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  const authUserId = AuthUserIdSchema.parse(session.user.id);
  return await store.getOrCreateUserId(authUserId);
}
