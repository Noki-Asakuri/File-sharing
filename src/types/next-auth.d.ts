import { DefaultProfile, DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: DefaultSession["user"] & {
            discordID: string;
            isAdmin: boolean;
            name: string;
            image: string;
        };
    }

    interface User extends DefaultUser {
        discordID: string;
        isAdmin: boolean;
    }

    interface Profile extends DefaultProfile {
        id: string;
        accent_color: number;
        avatar: string;
        banner: string;
        banner_color: string;
        discriminator: string;
        email: string;
        flags: number;
        id: string;
        image_url: string;
        locale: string;
        mfa_enabled: boolean;
        premium_type: number;
        public_flags: number;
        username: string;
        verified: boolean;
    }

    // interface Account extends DefaultAccount {}
}
