// src/utils/trpc.ts
import type { AppRouter } from "@/server/trpc/routers";
import { setupTRPC } from "@trpc/next";
import { inferProcedureOutput } from "@trpc/server";
import superjson from "superjson";

import getBaseUrl from "./getBaseUrl";

export const trpc = setupTRPC<AppRouter>({
    config() {
        return {
            url: `${getBaseUrl()}/api/trpc`,
            transformer: superjson,
            queryClientConfig: {},
        };
    },
    ssr: false,
});

/**
 * Enum containing all api procedures
 */
export type TProcedures = keyof AppRouter["_def"]["procedures"];

/**
 * Enum containing all procedure paths
 */
export type TRouterPaths<TRouterKey extends TProcedures> =
    keyof AppRouter[TRouterKey]["_def"]["procedures"];

/**
 * This is a helper method to infer the output of a procedure
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferProceduresOutput<
    TRouteKey extends TProcedures,
    TRoutePath extends TRouterPaths<TRouteKey>,
> = inferProcedureOutput<AppRouter[TRouteKey][TRoutePath]>;
