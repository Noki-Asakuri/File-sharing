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
                const file = await ctx.prisma.file.findUnique({ where: { fileID } });
                const newUnlocked: string[] = file?.unlockedUser
                    ? [...file.unlockedUser, ctx.session.user.discordID]
                    : [ctx.session.user.discordID];

                await ctx.prisma.file.update({
                    where: { fileID },
                    data: { unlockedUser: newUnlocked },
                });
            }

            return { download: true };
        }),
});
