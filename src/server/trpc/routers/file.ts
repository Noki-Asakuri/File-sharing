import { z } from "zod";
import { authedProcedure, t } from "../trpc";

import { TRPCError } from "@trpc/server";
import { hashSync } from "bcrypt";

export const fileRouter = t.router({
    dashboard: authedProcedure
        .input(z.object({ search: z.string().optional(), limit: z.number().min(0).max(25) }))
        .query(async ({ input, ctx }) => {
            const { limit, search } = input;

            const user = await ctx.prisma.user.findFirst({
                where: { discordID: ctx.session.user.discordID },
            });

            if (!user) {
                throw new TRPCError({ message: "No user found!", code: "NOT_FOUND" });
            }

            const files = await ctx.prisma.file.findMany({
                where: {
                    authorID: user.isAdmin ? undefined : user.discordID,
                    name: search?.length ? { contains: search } : undefined,
                },
                orderBy: { id: "desc" },
            });

            const totalPage = Math.ceil(files.length / limit);
            let pages: typeof files[] = [];

            for (let i = 0; i < totalPage; i++) {
                pages = [...pages, files.slice(i * limit, (i + 1) * limit)];
            }

            return { totalPage, pages, totalFiles: files.length };
        }),
    delete_by_id: authedProcedure
        .input(z.object({ fileID: z.string() }))
        .mutation(async ({ input: { fileID }, ctx }) => {
            const file = await ctx.prisma.file.findFirst({ where: { fileID } });

            if (!file) {
                throw new TRPCError({
                    message: "No file found with that id!",
                    code: "NOT_FOUND",
                });
            }

            await Promise.all([
                ctx.supabase.remove([file.path]),
                ctx.prisma.file.delete({ where: { id: file.id } }),
            ]);

            return { status: "Success" };
        }),
    download: t.procedure
        .input(z.object({ fileID: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, supabase } = ctx;

            const file = await prisma.file.findFirstOrThrow({
                where: { fileID: input.fileID },
            });

            await prisma.file.update({
                where: { id: file.id },
                data: { downloadCount: file.downloadCount + 1 },
            });

            return {
                downloadUrl: (await supabase.createSignedUrl(file.path, 60)).signedURL as string,
            };
        }),
    update_pass: authedProcedure
        .input(z.object({ fileID: z.string(), authorID: z.string(), newPassword: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const { prisma } = ctx;
            const { fileID, authorID, newPassword } = input;

            await prisma.file.update({
                where: { fileID },
                data: { password: hashSync(newPassword, 10), unlockedUser: [authorID] },
            });
        }),
});
