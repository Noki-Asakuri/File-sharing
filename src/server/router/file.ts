import { z } from "zod";
import { createRouter } from "./context";
import supabase from "@/server/db/supabase";

import genID from "@/utils/genID";
import { decode } from "base64-arraybuffer";
import * as bcrypt from "bcrypt";

const UploadFile = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    path: z.string(),
    fileUrl: z.string(),
    password: z.string().optional(),
});

type UploadFile = z.infer<typeof UploadFile>;

export const exampleRouter = createRouter()
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
                url: file.fileUrl,
                name: file.name,
            };
        },
    })
    .query("get-all", {
        async resolve({ ctx }) {
            return await ctx.prisma.file.findMany();
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
    .mutation("upload-file", {
        input: z.object({
            name: z.string(),
            password: z.string().optional(),
            type: z.string(),
            fileBuffer: z.string(),
        }),
        resolve: async ({ input, ctx }) => {
            const { file, fileID } = genID(input.name);

            const { error } = await supabase.storage
                .from("files")
                .upload(file, decode(input.fileBuffer), {
                    contentType: input.type,
                });

            if (error) {
                return {
                    id: fileID,
                    name: input.name,
                    url: "None",
                    password: "None",
                    type: input.type,
                    error: error,
                };
            }

            const { publicURL } = supabase.storage
                .from("files")
                .getPublicUrl(file);

            let newData: UploadFile = {
                id: fileID,
                name: input.name,
                type: input.type,
                path: file,
                fileUrl: publicURL as string,
            };

            if (input.password) {
                newData = {
                    ...newData,
                    password: await bcrypt.hash(input.password, 10),
                };
            }

            const data = await ctx.prisma.file.create({ data: newData });

            return {
                id: data.id,
                name: data.name,
                type: data.type,
                url: `${ctx.req?.headers.origin}/file/${data.id}`,
                password: data.password || "None",
                error: null,
            };
        },
    });
