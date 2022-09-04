import { Account, DefaultProfile, DefaultSession, DefaultUser, User } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends DefaultSession {
        accessToken?: string;
        user: DefaultSession["user"] & {
            discordID: string;
            isAdmin: boolean;
            name: string;
            image: string;
        };
        expires: string;
    }

    interface User extends DefaultUser {
        discordID: string;
        isAdmin: boolean;
        apiKey: string?;
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

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        user: User;
        account: Account;
    }
}
