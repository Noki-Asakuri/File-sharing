import NextAuth, {
    DefaultUser,
    DefaultSession,
    DefaultProfile,
    DefaultAccount,
} from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            discordID: string;
            role: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        discordID: string;
        role: string;
    }

    interface Profile extends DefaultProfile {
        id: string;
    }

    interface Account extends DefaultAccount {
        role: string;
    }
}
