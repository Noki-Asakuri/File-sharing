import { z } from "zod";
import { createRouter } from "./context";

import * as bcrypt from "bcrypt";

const UploadFile = z.object({
    fileID: z.string(),
    name: z.string(),
    url: z.string(),
    type: z.string(),
    path: z.string(),
    author: z.string(),
    authorID: z.string(),
    password: z.string().optional(),
});

type UploadFile = z.infer<typeof UploadFile>;

export const fileRouter = createRouter()
    .query("get-file", {
        input: z.object({
            id: z.string().optional(),
        }),
        resolve: async ({ input, ctx }) => {
            if (!input.id) {
                return { passwordLock: null, error: "No ID provided!" };
            }

            const file = await ctx.prisma.file.findFirst({
                where: { fileID: input.id },
            });

            if (!file) {
                return {
                    passwordLock: null,
                    error: "File not found! Redirecting ...",
                };
            }

            return {
                passwordLock: !!file.password,
                error: null,
                url: file.url,
                name: file.name,
            };
        },
    })
    .query("get-file-by-id", {
        input: z.object({
            userID: z.string(),
            search: z.string().optional(),
            limit: z.number().min(0).max(25),
        }),
        resolve: async ({ input, ctx }) => {
            const { limit, search } = input;

            const user = await ctx.prisma.user.findFirst({
                where: { discordID: input.userID },
            });

            if (!user) {
                throw new Error("No user found!");
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
            if (await bcrypt.compare(input.inputPassword, input.filePassword)) {
                return { download: true, error: null };
            }
            return { download: false, error: "Wrong password!" };
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
                return {
                    error: "No file found with provided id.",
                };
            }

            const newFile = await ctx.prisma.file.update({
                where: { id: file.id },
                data: { downloadCount: file.downloadCount + 1 },
            });

            return {
                downloadCount: newFile.downloadCount,
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
            author: z.string(),
            authorID: z.string(),
        }),
        resolve: async ({ input, ctx }) => {
            const { path, name, type, fileID, password, author, authorID } =
                input;

            const { publicURL } = ctx.supabase.storage
                .from("files")
                .getPublicUrl(path);

            let newData: UploadFile = {
                fileID: fileID,
                name: name,
                type: type,
                path: path,
                author: author,
                authorID: authorID,
                url: publicURL as string,
            };

            if (password) {
                newData = {
                    ...newData,
                    password: await bcrypt.hash(password, 10),
                };
            }

            const data = await ctx.prisma.file.create({ data: newData });

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
                return {
                    state: "Failed",
                    error: "No file found with that id!",
                };
            }

            await ctx.supabase.storage.from("files").remove([file.path]);
            await ctx.prisma.file.delete({
                where: { id: file.id },
            });

            return {
                state: "Success",
                error: null,
            };
        },
    });
