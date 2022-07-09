import React from "react";
import Head from "next/head";

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
                <meta property="og:site_name" content="File Sharing" />
                <meta
                    property="og:description"
                    content="A worst possible website to share file."
                />
                <meta property="og:image" content="/favicon.svg" />
                <meta name="theme-color" content="#2f3136" />
            </Head>
            {children}
        </>
    );
};

export default MainLayout;
