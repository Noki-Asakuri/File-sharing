import { z } from "zod";

import * as bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { t } from "../trpc";

export const checkRouter = t.router({
    password: t.procedure
        .input(z.object({ fileID: z.string(), password: z.string(), inputPassword: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const { fileID, inputPassword, password } = input;

            if (!bcrypt.compareSync(inputPassword, password)) {
                throw new TRPCError({ message: "Incorrect password!", code: "BAD_REQUEST" });
            }

            if (ctx.session) {
                await ctx.prisma.file.update({
                    where: { fileID },
                    data: { unlockedUser: { push: ctx.session.user.discordID } },
                });
            }

            return { download: true };
        }),
});
