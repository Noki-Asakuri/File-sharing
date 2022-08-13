import { z } from "zod";
import { createRouter } from "../context";

import * as bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const checkRouter = createRouter().mutation("password", {
    input: z.object({
        fileID: z.string(),
        password: z.string(),
        inputPassword: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
        const { inputPassword, password, fileID } = input;

        if (!bcrypt.compareSync(inputPassword, password)) {
            throw new TRPCError({
                message: "Incorrect password!",
                code: "BAD_REQUEST",
            });
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
            await ctx.res?.revalidate(`/file/${fileID}`);
        }

        return { download: true };
    },
});
