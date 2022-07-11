import NextAuth, {
    DefaultUser,
    DefaultSession,
    DefaultProfile,
} from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            discordID: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        discordID: string;
    }

    interface Profile extends DefaultProfile {
        id: string;
    }
}
