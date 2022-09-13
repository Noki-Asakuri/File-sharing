import { z } from "zod";
import { authedProcedure, t } from "../trpc";

import { TRPCError } from "@trpc/server";
import { hashSync } from "bcrypt";

export const fileRouter = t.router({
    dashboard: authedProcedure
        .input(z.object({ search: z.string().optional(), limit: z.number().min(0).max(25) }))
        .query(async ({ input, ctx }) => {
            const { limit, search } = input;
            const { prisma, session } = ctx;

            const files = await prisma.file.findMany({
                where: {
                    authorID: session.user.isAdmin ? undefined : session.user.discordID,
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
            const file = await ctx.prisma.file.findFirst({
                where: { fileID },
                select: { path: true, id: true },
            });

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
        .input(z.object({ fileID: z.string(), path: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const { prisma, supabase } = ctx;

            const [url] = await Promise.all([
                supabase.createSignedUrl(input.path, 60),
                prisma.file.update({
                    where: { fileID: input.fileID },
                    data: { downloadCount: { increment: 1 } },
                }),
            ]);

            return { downloadUrl: url.signedURL as string };
        }),
    update_pass: authedProcedure
        .input(
            z.object({
                fileID: z.string(),
                authorID: z.string(),
                newPassword: z.string().optional(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { fileID, authorID, newPassword } = input;

            await ctx.prisma.file.update({
                where: { fileID },
                data: {
                    password: newPassword ? hashSync(newPassword, 10) : null,
                    unlockedUser: [authorID],
                },
            });
        }),
});
