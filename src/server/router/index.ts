// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "./context";

import { fileRouter } from "./file";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("file.", fileRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

