import React from "react";
import Head from "next/head";
import Navbar from "../Nav/MainNav";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <Head>
                <title>File Sharing - Freunds</title>
                <link rel="icon" href="/favicon.svg" />
                <meta name="description" content="Free file sharing website!" />
                <meta name="author" content="Freunds#8323" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="theme-color" content="#2f3136" />
            </Head>
            <Navbar />
            {children}
        </>
    );
};

export default MainLayout;
