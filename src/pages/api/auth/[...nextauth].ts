import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db/client";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        maxAge: 24 * 60 * 60,
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
            session.user.discordID = user.discordID;

            return session;
        },
    },
});
