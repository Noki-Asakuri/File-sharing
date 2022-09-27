// src/pages/_app.tsx
import MainLayout from "$lib/components/Layout/MainLayout";
import { trpc } from "$lib/utils/trpc";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppProps } from "next/app";

import "$lib/styles/globals.css";

const MyApp = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
    return (
        <SessionProvider session={session}>
            <MainLayout>
                <Component {...pageProps} />
            </MainLayout>
        </SessionProvider>
    );
};

export default trpc.withTRPC(MyApp);
