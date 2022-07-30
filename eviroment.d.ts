declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_SUPABASE_KEY: string;

            DISCORD_CLIENT_ID: string;
            DISCORD_CLIENT_SECRET: string;

            ADMIN_IDS: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
