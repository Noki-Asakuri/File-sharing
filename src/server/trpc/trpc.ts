// src/server/router/index.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

export const t = initTRPC<{ ctx: Context }>()({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({ ctx: { ...ctx, session: ctx.session } });
});

export const authedProcedure = t.procedure.use(isAuthed);
