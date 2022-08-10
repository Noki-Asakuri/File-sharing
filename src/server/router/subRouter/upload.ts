import { z } from "zod";
import { createRouter } from "../context";

import { hashSync } from "bcrypt";
import { TRPCError } from "@trpc/server";

export const uploadRouter = createRouter()
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({
                message: "Unauthorized",
                code: "UNAUTHORIZED",
            });
        }

        return next({ ctx: { ...ctx, session: ctx.session } });
    })
    .mutation("file", {
        input: z.object({
            fileID: z.string(),
            name: z.string(),
            password: z.string().optional(),
            type: z.string(),
            path: z.string(),
        }),
        resolve: async ({ input, ctx }) => {
            const { path, name, type, fileID, password } = input;

            const data = await ctx.prisma.file.create({
                data: {
                    fileID: fileID,
                    name: name,
                    type: type,
                    path: path,
                    author: ctx.session.user.name as string,
                    authorID: ctx.session.user.discordID,
                    password: password ? hashSync(password, 10) : null,
                    unlockedUser: [ctx.session.user.discordID],
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
                url: `/file/${data.fileID}`,
                fullUrl: `${ctx.req?.headers.origin}/file/${data.fileID}`,
                password: data.password || "None",
            };
        },
    });
