declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUPABASE_KEY: string;

            FIREBASE_API: string;
            FIREBASE_AUTH: string;
            FIREBASE_PROJECT: string;
            FIREBASE_STORAGE: string;
            FIREBASE_MESSAGE: string;
            FIREBASE_APP: string;
            FIREBASE_MEASUREMENT: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
