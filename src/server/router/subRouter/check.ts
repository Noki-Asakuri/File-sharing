import { z } from "zod";
import { createRouter } from "../context";

import * as bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const checkRouter = createRouter().mutation("password", {
    input: z.object({
        filePassword: z.string(),
        inputPassword: z.string(),
    }),
    resolve: async ({ input }) => {
        if (!(await bcrypt.compare(input.inputPassword, input.filePassword))) {
            throw new TRPCError({
                message: "Wrong password!",
                code: "BAD_REQUEST",
            });
        }
        return { download: true };
    },
});
