import type { NextAuthOptions } from "next-auth";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { prisma } from "$lib/server/db/prisma";
import { getNewAvatar } from "$lib/utils/getNewAvatar";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // ? NOTE: 30 days session.
        updateAge: 24 * 60 * 60, // ? NOTE: 1 day update.
    },
    secret: process.env.NEXTAUTH_JWT,
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

            // ? Future ban list?
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
        async jwt({ token, account, user }) {
            // Persist the OAuth access_token to the token right after signing in
            if (account) {
                token.account = account;
            }
            if (user) {
                token.user = user;
            }

            return token;
        },
        async session({ session, token }) {
            return {
                accessToken: token.account.access_token,
                expires: session.expires,
                user: {
                    ...session.user,
                    discordID: token.user.discordID,
                    isAdmin: token.user.isAdmin,
                },
            };
        },
    },
    events: {
        async session({ session }) {
            const { newAvatarID, user } = await getNewAvatar({ session });
            const currentAvatar = user?.image
                ?.slice(user?.image.lastIndexOf("/") + 1)
                .split(".") as string[];

            const currentAvatarID = currentAvatar[0];
            const currentAvatarFormat = currentAvatar[1];

            if (currentAvatarID !== newAvatarID) {
                await prisma.user.update({
                    where: { discordID: session.user.discordID },
                    data: {
                        image: `https://cdn.discordapp.com/avatars/${session.user.discordID}/${newAvatarID}.${currentAvatarFormat}`,
                    },
                });
            }
        },
    },
};

export default NextAuth(authOptions);
