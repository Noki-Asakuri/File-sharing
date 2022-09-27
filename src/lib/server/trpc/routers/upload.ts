import { z } from "zod";
import { authedProcedure, t } from "../trpc";

import { hashSync } from "bcrypt";
import { TRPCError } from "@trpc/server";

export const uploadRouter = t.router({
    withAuth: authedProcedure
        .input(
            z.object({
                fileID: z.string(),
                name: z.string(),
                password: z.string().optional(),
                type: z.string(),
                path: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { path, name, type, fileID, password } = input;

            await ctx.prisma.file.create({
                data: {
                    fileID,
                    name,
                    type,
                    path,
                    author: ctx.session.user.name,
                    authorID: ctx.session.user.discordID,
                    password: password ? hashSync(password, 10) : null,
                    unlockedUser: [ctx.session.user.discordID],
                },
            });

            return {
                fileID,
                name,
                type,
                url: `/file/${fileID}`,
                fullUrl: `${ctx.req.headers.origin}/file/${fileID}`,
            };
        }),
    noAuth: t.procedure
        .input(
            z.object({
                fileID: z.string(),
                name: z.string(),
                password: z.string().optional(),
                type: z.string(),
                path: z.string(),
                apiKey: z.string().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { path, name, type, fileID, password, apiKey } = input;
            const user = await ctx.prisma.user.findUnique({
                where: { apiKey },
                select: { name: true, discordID: true },
            });

            if (!user) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "API Key is invalided." });
            }

            await ctx.prisma.file.create({
                data: {
                    fileID,
                    name,
                    type,
                    path,
                    author: user.name as string,
                    authorID: user.discordID,
                    password: password ? hashSync(password, 10) : null,
                    unlockedUser: [user.discordID],
                },
            });

            return {
                fileID,
                name,
                type,
                url: `/file/${fileID}`,
                fullUrl: `${ctx.req.headers.origin}/file/${fileID}`,
            };
        }),
});
