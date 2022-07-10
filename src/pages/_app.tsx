// src/pages/_app.tsx
import AuthWrapper from "@/components/Layout/AuthWrapper";
import MainLayout from "@/components/Layout/main";
import type { AppRouter } from "@/server/router";
import getBaseUrl from "@/utils/getBaseUrl";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import "../styles/globals.css";

const MyApp: AppType = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <AuthWrapper>
                <MainLayout>
                    <Component {...pageProps} />
                </MainLayout>
            </AuthWrapper>
        </SessionProvider>
    );
};

export default withTRPC<AppRouter>({
    config({ ctx }) {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        const url = `${getBaseUrl()}/api/trpc`;

        return {
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
})(MyApp);
