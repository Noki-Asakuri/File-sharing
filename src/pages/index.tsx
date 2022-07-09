import type { NextPage } from "next";

import React, { useEffect, useState } from "react";

import UploadedFile from "@/components/UploadedFile";
import UploadForm from "@/components/UploadForm";
import useStorage from "@/server/hooks/useStorage";
import Head from "next/head";

interface UploadFile {
    fileID: string;
    name: string;
    type: string;
    password?: string;
}

interface ReturnFile {
    fileID: string;
    name: string;
    type: string;
    url: string;
    password: string;
}

const Home: NextPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setUploading] = useState<boolean>(false);

    const [uploadFile, setUploadFile] = useState<ReturnFile | undefined>(
        undefined
    );

    useStorage({ file, isUploading, password, setUploadFile });

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let selected = e.target.files![0];

        if (selected && selected.size < 52428800) {
            setFile(selected);
            setError("");
        } else {
            setFile(null);
            setError("File size over 50mb limit!");
        }
    };

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
    };

    useEffect(() => {
        if (uploadFile) {
            setUploading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadFile]);

    return (
        <>
            <Head>
                <meta property="og:title" content="Website to share files." />
            </Head>
            <div className="max-w-7xl mx-auto my-0 h-screen">
                <header>
                    <nav className="font-normal">
                        <span className="text-3xl tracking-wider text-blue-500">
                            Freunds
                        </span>
                    </nav>
                    <h2 className="mt-16 text-4xl text-center">File Sharing</h2>
                    <p className="text-center pt-5 max-w-2xl m-auto">
                        A simple file sharing website so i don&apos;t need to
                        fucking host the fucking file on fucking google drive
                        each time i need to fucking share a file though discord
                        without a bullshit 8mb limit.
                    </p>
                </header>

                <div className="flex justify-around flex-wrap pt-20 gap-10">
                    <UploadForm
                        file={file}
                        error={error}
                        isUploading={isUploading}
                        submitHandler={submitHandler}
                        passwordHandler={passwordHandler}
                        changeHandler={changeHandler}
                    />

                    <UploadedFile file={file} uploadFile={uploadFile} />
                </div>

                <footer className="relative my-20 bottom-0 flex justify-center items-center">
                    <span>Made by Freunds#8323</span>
                </footer>
            </div>
        </>
    );
};

export default Home;
