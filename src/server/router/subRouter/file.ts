import { z } from "zod";
import { createRouter } from "../context";

import { TRPCError } from "@trpc/server";

export const fileRouter = createRouter()
    .query("get-file-by-id", {
        input: z.object({
            search: z.string().optional(),
            limit: z.number().min(0).max(25),
        }),
        resolve: async ({ input, ctx }) => {
            const { limit, search } = input;

            const user = await ctx.prisma.user.findFirst({
                where: { discordID: ctx.session?.user.discordID },
            });

            if (!user) {
                throw new TRPCError({
                    message: "No user found!",
                    code: "NOT_FOUND",
                });
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
        },
    })
    .mutation("delete-file-by-id", {
        input: z.object({
            fileID: z.string(),
        }),
        resolve: async ({ input, ctx }) => {
            const file = await ctx.prisma.file.findFirst({
                where: { fileID: input.fileID },
            });

            if (!file) {
                throw new TRPCError({
                    message: "No file found with that id!",
                    code: "NOT_FOUND",
                });
            }

            await ctx.supabase.storage.from("files").remove([file.path]);
            await ctx.prisma.file.delete({
                where: { id: file.id },
            });

            try {
                ctx.res?.revalidate(`/file/${input.fileID}`);
            } catch (err) {
                throw new TRPCError({
                    message: err as string,
                    code: "INTERNAL_SERVER_ERROR",
                });
            }

            return { status: "Success" };
        },
    })
    .mutation("download-file", {
        input: z.object({
            fileID: z.string(),
        }),
        resolve: async ({ input, ctx }) => {
            const { prisma, supabase } = ctx;

            const file = await prisma.file.findFirstOrThrow({
                where: { fileID: input.fileID },
            });

            await prisma.file.update({
                where: { id: file.id },
                data: { downloadCount: file.downloadCount + 1 },
            });

            return {
                downloadUrl: (await supabase.storage.from("files").createSignedUrl(file.path, 60))
                    .signedURL!,
            };
        },
    });
