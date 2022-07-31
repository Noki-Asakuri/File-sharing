import { z } from "zod";
import { createRouter } from "../context";

import * as bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const checkRouter = createRouter().mutation("password", {
    input: z.object({
        password: z.string(),
        inputPassword: z.string(),
    }),
    resolve: async ({ input }) => {
        const { inputPassword, password } = input;

        if (!(await bcrypt.compare(inputPassword, password))) {
            throw new TRPCError({
                message: "Incorrect password!",
                code: "BAD_REQUEST",
            });
        }
        return { download: true };
    },
});
