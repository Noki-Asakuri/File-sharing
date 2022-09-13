import { authedProcedure, t } from "../trpc";
import { v4 as uuidv4 } from "uuid";

export const userRouter = t.router({
    getKey: authedProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.user.findUnique({
            where: { discordID: ctx.session.user.discordID },
            select: { apiKey: true },
        });
    }),
    createKey: authedProcedure.mutation(async ({ ctx }) => {
        const apiKey = uuidv4();

        await ctx.prisma.user.update({
            where: { discordID: ctx.session.user.discordID },
            data: { apiKey },
        });

        return apiKey;
    }),
});
