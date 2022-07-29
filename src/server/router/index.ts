// src/server/router/index.ts
import superjson from "superjson";
import { ZodError } from "zod";
import { createRouter } from "./context";

import { fileRouter } from "./subRouter/file";
import { checkRouter } from "./subRouter/check";
import { uploadRouter } from "./subRouter/upload";

export const appRouter = createRouter()
    .formatError(({ shape, error }) => {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.code === "BAD_REQUEST" &&
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    })
    .transformer(superjson)
    .merge("file.", fileRouter)
    .merge("check.", checkRouter)
    .merge("upload.", uploadRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
