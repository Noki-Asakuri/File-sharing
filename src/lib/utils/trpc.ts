// src/utils/trpc.ts
import type { AppRouter } from "$lib/server/trpc/routers";

import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { inferProcedureOutput } from "@trpc/server";
import superjson from "superjson";

import getBaseUrl from "./getBaseUrl";

export const trpc = createTRPCNext<AppRouter>({
    config({ ctx }) {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        const url = `${getBaseUrl()}/api/trpc`;
        // optional: use SSG-caching for each rendered page (see caching section for more details)
        const ONE_DAY_SECONDS = 60 * 60 * 24;
        ctx?.res?.setHeader(
            "Cache-Control",
            `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`,
        );

        return {
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
                httpBatchLink({ url }),
            ],
            url,
            transformer: superjson,
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
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
 * @example type HelloOutput = InferProceduresOutput<'hello'>
 */
export type InferProceduresOutput<
    TRouteKey extends TProcedures,
    TRoutePath extends TRouterPaths<TRouteKey>,
> = inferProcedureOutput<AppRouter[TRouteKey][TRoutePath]>;
