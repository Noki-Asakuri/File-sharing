// src/pages/_app.tsx
import MainLayout from "@/components/Layout/MainLayout";
import { trpc } from "@/utils/trpc";

import type { AppType } from "next/dist/shared/lib/utils";
import { SessionProvider } from "next-auth/react";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={session}>
            <MainLayout>
                <Component {...pageProps} />
            </MainLayout>
        </SessionProvider>
    );
};

export default trpc.withTRPC(MyApp);
