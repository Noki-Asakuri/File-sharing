import { z } from "zod";
import { createRouter } from "./context";

import * as bcrypt from "bcrypt";

const UploadFile = z.object({
    id: z.string(),
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
                where: { id: input.id },
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
                where: { id: input.id },
            });

            if (!file) {
                return {
                    error: "No file found with provided id.",
                };
            }

            const newFile = await ctx.prisma.file.update({
                where: { id: input.id },
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
                id: fileID,
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
                fileID: data.id,
                name: data.name,
                type: data.type,
                url: `${ctx.req?.headers.origin}/file/${data.id}`,
                password: data.password || "None",
            };
        },
    });
