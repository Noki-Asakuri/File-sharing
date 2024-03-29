import { prisma } from "$lib/server/db/prisma";
import type { Session } from "next-auth";

type RefreshRes = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
};

export const getNewAvatar = async ({ session }: { session: Session }) => {
    const account = await prisma.account.findUnique({
        where: {
            provider_providerAccountId: {
                providerAccountId: session.user.discordID,
                provider: "discord",
            },
        },
        select: { user: true, access_token: true, refresh_token: true, id: true },
    });

    const res = await fetch("https://discord.com/api/v10/users/@me", {
        headers: { authorization: `Bearer ${account?.access_token}` },
    });

    if (!res.ok) {
        const refreshBody = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: account?.refresh_token as string,
        });

        const { access_token, expires_in, refresh_token }: RefreshRes = await (
            await fetch("https://discord.com/api/v10/oauth2/token", {
                method: "POST",
                body: refreshBody,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            })
        ).json();

        const [res] = await Promise.all([
            fetch("https://discord.com/api/v10/users/@me", {
                headers: { authorization: `Bearer ${access_token}` },
            }),
            prisma.account.update({
                where: { id: account?.id },
                data: { access_token, expires_at: expires_in, refresh_token },
            }),
        ]);

        return { newAvatarID: (await res.json()).avatar, user: account?.user };
    }

    return { newAvatarID: (await res.json()).avatar, user: account?.user };
};
