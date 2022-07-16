// src/server/router/index.ts
import superjson from "superjson";
import { ZodError } from "zod";
import { createRouter } from "./context";

import { fileRouter } from "./file";

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
    .merge("file.", fileRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
