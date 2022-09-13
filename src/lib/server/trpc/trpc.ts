// src/server/router/index.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter: ({ shape }) => shape,
});

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({ ctx: { ...ctx, session: ctx.session } });
});

export const authedProcedure = t.procedure.use(isAuthed);
