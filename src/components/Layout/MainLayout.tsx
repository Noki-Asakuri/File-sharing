import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

import AuthWrapper from "./AuthWrapper";

const Navbar = dynamic(() => import("../Nav/MainNav"), { ssr: false });

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <Head>
                <title>File Sharing</title>
                <link rel="icon" href="/favicon.svg" />
                <meta name="description" content="File sharing website!" />
                <meta name="author" content="Asakuri#8323" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="theme-color" content="#2f3136" />
            </Head>
            <Navbar />
            <AuthWrapper>{children}</AuthWrapper>
        </>
    );
};

export default MainLayout;
