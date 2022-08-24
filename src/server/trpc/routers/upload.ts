import { z } from "zod";
import { authedProcedure, t } from "../trpc";

import { hashSync } from "bcrypt";

export const uploadRouter = t.router({
    file: authedProcedure
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

            const data = await ctx.prisma.file.create({
                data: {
                    fileID: fileID,
                    name: name,
                    type: type,
                    path: path,
                    author: ctx.session.user.name,
                    authorID: ctx.session.user.discordID,
                    password: password ? hashSync(password, 10) : null,
                    unlockedUser: [ctx.session.user.discordID],
                },
            });

            return {
                fileID: data.fileID,
                name: data.name,
                type: data.type,
                url: `/file/${data.fileID}`,
                fullUrl: `${ctx.req.headers.origin}/file/${data.fileID}`,
                password: data.password || "None",
            };
        }),
});
