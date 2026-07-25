import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { db } from "../sensors/db.js";

export const createContext = () => ({});
export type Context = ReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const appRouter = t.router({
  health: t.procedure.query(async ({ ctx }) => {
    const result = await db.query<{ now: Date }>("select now()");
    return { ok: true, databaseTime: result.rows[0].now.toISOString() };
  }),
});

export type AppRouter = typeof appRouter;
