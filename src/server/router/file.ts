import { z } from "zod";
import { createRouter } from "./context";

import * as bcrypt from "bcrypt";
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
                    authorID:
                        user.role !== "Owner" ? user.discordID : undefined,
                    name: search?.length ? { contains: search } : undefined,
                },
                orderBy: { id: "asc" },
            });

            const totalPage = Math.ceil(files.length / limit);
            let pages: typeof files[] = [];

            for (let i = 0; i < totalPage; i++) {
                pages = [...pages, files.slice(i * limit, (i + 1) * limit)];
            }

            return {
                totalPage,
                pages,
            };
        },
    })
    .mutation("password-check", {
        input: z.object({
            filePassword: z.string(),
            inputPassword: z.string(),
        }),
        resolve: async ({ input }) => {
            if (
                !(await bcrypt.compare(input.inputPassword, input.filePassword))
            ) {
                throw new TRPCError({
                    message: "Wrong password!",
                    code: "BAD_REQUEST",
                });
            }
            return { download: true };
        },
    })
    .mutation("update-download-count", {
        input: z.object({
            id: z.string(),
        }),
        resolve: async ({ input, ctx }) => {
            const file = await ctx.prisma.file.findFirst({
                where: { fileID: input.id },
            });

            if (!file) {
                throw new TRPCError({
                    message: "No file found with provided id",
                    code: "NOT_FOUND",
                });
            }

            await ctx.prisma.file.update({
                where: { id: file.id },
                data: { downloadCount: file.downloadCount + 1 },
            });

            return {
                status: "Success",
            };
        },
    })
    .mutation("upload-file", {
        input: z.object({
            fileID: z.string(),
            name: z.string(),
            password: z.string().optional(),
            type: z.string(),
            path: z.string(),
        }),
        resolve: async ({ input, ctx }) => {
            const { path, name, type, fileID, password } = input;

            if (!ctx.session) {
                throw new TRPCError({
                    message: "UNAUTHORIZED",
                    code: "UNAUTHORIZED",
                });
            }

            const { publicURL } = ctx.supabase.storage
                .from("files")
                .getPublicUrl(path);

            const data = await ctx.prisma.file.create({
                data: {
                    fileID: fileID,
                    name: name,
                    type: type,
                    path: path,
                    author: ctx.session.user.name as string,
                    authorID: ctx.session.user.discordID as string,
                    url: publicURL as string,
                    password: password ? await bcrypt.hash(password, 10) : null,
                },
            });

            return {
                fileID: data.fileID,
                name: data.name,
                type: data.type,
                url: `${ctx.req?.headers.origin}/file/${data.fileID}`,
                password: data.password || "None",
            };
        },
    })
    .mutation("delete-file-by-id", {
        input: z.object({
            fileID: z.string(),
        }),
        resolve: async ({ input, ctx }) => {
            const file = await ctx.prisma.file.findFirst({
                where: {
                    fileID: input.fileID,
                },
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

            return {
                status: "Success",
            };
        },
    });
