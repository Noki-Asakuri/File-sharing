import { z } from "zod";
import { createRouter } from "../context";

import * as bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const uploadRouter = createRouter().mutation("file", {
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

        try {
            await ctx.res?.revalidate(`/file/${fileID}`);
        } catch (err) {
            throw new TRPCError({
                message: err as string,
                code: "INTERNAL_SERVER_ERROR",
            });
        }

        return {
            fileID: data.fileID,
            name: data.name,
            type: data.type,
            url: `${ctx.req?.headers.origin}/file/${data.fileID}`,
            password: data.password || "None",
        };
    },
});
