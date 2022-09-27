import type { NextPage } from "next";

import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Head from "next/head";

const Upload = dynamic(() => import("$lib/components/Upload"), { ssr: false });

const Home: NextPage = () => {
    const { data: session } = useSession();

    return (
        <>
            <Head>
                <meta property="og:title" content="Website to share files." />
                <meta property="og:site_name" content="File Sharing" />
                <meta
                    property="og:description"
                    content="The worst possible website to share file."
                />
                <meta property="og:image" content="/favicon.svg" />
            </Head>
            <div className="container mx-auto flex flex-col items-center justify-center md:h-full lg:h-screen">
                <header className="pt-28">
                    <h2 className="text-center text-4xl ">File Sharing</h2>
                    <p className="m-auto max-w-2xl pt-5 text-center">
                        A simple file-sharing website so I don&apos;t need to fucking host the
                        fucking file on fucking google drive each time I need to fucking share a
                        file through discord without a bullshit 8MB limit.
                    </p>
                </header>

                <Upload isAuth={!!session} />

                <footer className="relative bottom-0 my-20 flex flex-col items-center justify-center gap-y-3">
                    <span className="animate-rainbow bg-rainbow-text bg-clip-text text-2xl font-bold tracking-wide text-transparent">
                        Made by Asakuri#8323
                    </span>
                </footer>
            </div>
        </>
    );
};

export default Home;
