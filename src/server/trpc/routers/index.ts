// src/server/router/index.ts
import { t } from "../trpc";

import { checkRouter } from "./check";
import { fileRouter } from "./file";
import { uploadRouter } from "./upload";

export const appRouter = t.router({ check: checkRouter, file: fileRouter, upload: uploadRouter });

// export type definition of API
export type AppRouter = typeof appRouter;
