import { prisma } from "@/server/db/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, // ? NOTE: 30 days session.
        updateAge: 24 * 60 * 60, // ? NOTE: 1 day update.
    },
    theme: {
        colorScheme: "dark", // "auto" | "dark" | "light"
        brandColor: "#3a82f6", // Hex color code
        logo: "https://cdn.discordapp.com/app-icons/995449385955635291/85c876d481eac600c58b1d3848b18f68.png?size=256", // Absolute URL to image
        buttonText: "#ec9fff", // Hex color code
    },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, profile }) {
            user.name = `${profile.username}#${profile.discriminator}`;
            user.discordID = profile.id;

            user.isAdmin = profile.id === "188903265931362304";

            // Future ban list?
            const isAllowedToSignIn = true;

            if (isAllowedToSignIn) {
                return true;
            } else {
                // Return false to display a default error message
                return false;
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        },
        async session({ session, user }) {
            return {
                user: {
                    ...session.user,
                    discordID: user.discordID,
                    isAdmin: user.isAdmin,
                },
                expires: session.expires,
            };
        },
    },
    events: {
        async session({ session }) {
            const [user, account] = await Promise.all([
                prisma.user.findFirst({
                    where: { discordID: session.user.discordID },
                }),
                prisma.account.findFirst({
                    where: { providerAccountId: session.user.discordID },
                }),
            ]);

            const res = await fetch("https://discord.com/api/v10/users/@me", {
                headers: { authorization: `Bearer ${account?.access_token}` },
            });

            const newAvatarID = (await res.json()).avatar;
            const currentAvatar = user?.image?.slice(user?.image.lastIndexOf("/") + 1).split(".")!;
            const currentAvatarID = currentAvatar[0];
            const currentAvatarFormat = currentAvatar[1];

            if (currentAvatarID !== newAvatarID) {
                await prisma.user.update({
                    where: { discordID: user?.discordID },
                    data: {
                        image: `https://cdn.discordapp.com/avatars/${user?.discordID}/${newAvatarID}.${currentAvatarFormat}`,
                    },
                });
            }
        },
    },
};

export default NextAuth(authOptions);
