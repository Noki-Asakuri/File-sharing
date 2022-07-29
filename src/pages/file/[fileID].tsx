import download from "@/utils/download";
import type { NextPage } from "next";
import { GetStaticPropsContext } from "next";
import Head from "next/head";
import React, { useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import SpinningCircle from "@/components/SpinningCircle";
import { prisma } from "@/server/db/client";
import { trpc } from "@/utils/trpc";
import { File } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PasswordForm: React.FC<{
    filePassword: string;
    setPasswordLocked: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ filePassword, setPasswordLocked }) => {
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const passwordCheck = trpc.useMutation(["check.password"], {
        onSuccess: ({ download }) => {
            if (download) {
                setPasswordLocked(false);
            }
        },
    });

    return (
        <form className="relative flex flex-col items-start p-10 gap-y-7 max-w-max rounded-2xl bg-slate-800">
            <div className="flex justify-center w-full text-2xl">Password</div>
            <div className="flex items-center justify-center max-w-max gap-x-4">
                <input
                    className="px-4 py-2 bg-slate-700 rounded-2xl focus:outline-none"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="p-3 bg-slate-700 rounded-xl"
                    aria-label="toggle password display"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowPassword((current) => !current);
                    }}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
            </div>

            <button
                className="bg-slate-700 py-2 px-4 w-full rounded-2xl h-[40px]"
                onClick={(e) => {
                    e.preventDefault();

                    passwordCheck.mutate({
                        filePassword,
                        inputPassword: password,
                    });
                }}
            >
                Download
            </button>
            {passwordCheck.error && (
                <div className="">
                    <span className="text-sm text-red-600">
                        {passwordCheck.error.message}
                    </span>
                </div>
            )}
        </form>
    );
};

const FileDownload: NextPage<{ fileInfo: File }> = ({ fileInfo }) => {
    const [file] = useState<File>(fileInfo);
    const [passwordLocked, setPasswordLocked] = useState<boolean>(
        file.password !== null
    );
    const [isDownload, setIsDownload] = useState<boolean>(false);

    const downloadMutation = trpc.useMutation(["file.update-download-count"]);

    const downloadFile = useCallback(() => {
        download(file.url, file.name);
        downloadMutation.mutate({ id: file.fileID });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

    return (
        <>
            <Head>
                <title>{`File: ${file && file.name}`}</title>
                <meta
                    property="og:title"
                    content={`File Sharing by Freunds#8323`}
                />
                <meta
                    property="og:site_name"
                    content={`Author: ${file.author}`}
                />
                <meta
                    property="og:description"
                    content={`Files: ${file.name}.\nDownload: ${file.downloadCount}.`}
                />
                <meta
                    property="og:image"
                    content={
                        "https://cdn.discordapp.com/app-icons/995449385955635291/85c876d481eac600c58b1d3848b18f68.png?size=256"
                    }
                />
            </Head>
            <div className="flex justify-center items-center h-[90vh]">
                {passwordLocked ? (
                    <PasswordForm
                        filePassword={file.password as string}
                        setPasswordLocked={setPasswordLocked}
                    />
                ) : (
                    <div className="relative flex flex-col items-start p-10 gap-y-7 max-w-max rounded-2xl bg-slate-800">
                        <div className="flex justify-center w-full text-2xl">
                            Info
                        </div>
                        <div className="flex flex-col">
                            <span>Name: {file.name}</span>
                            <span>Author: {file.author}</span>
                            <span>Download: {file.downloadCount}</span>
                            <span>
                                Uploaded {file.createdAt as unknown as string}
                            </span>
                        </div>
                        <button
                            className="bg-slate-700 py-2 px-4 w-full rounded-2xl h-[40px]"
                            onClick={() => {
                                downloadFile();
                                setIsDownload((current) => !current);
                                setTimeout(() => {
                                    setIsDownload((current) => !current);
                                }, 1000);
                            }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isDownload ? (
                                    <>
                                        <span>Downloading</span>
                                        <div className="flex items-center justify-center">
                                            <SpinningCircle />
                                        </div>
                                    </>
                                ) : (
                                    <span>Click to download</span>
                                )}
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default FileDownload;

export async function getStaticProps(ctx: GetStaticPropsContext) {
    const file = await prisma.file.findFirst({
        where: { fileID: ctx.params?.fileID as string },
    });

    if (!file) {
        return { notFound: true };
    }

    return {
        props: {
            fileInfo: { ...file, createdAt: dayjs(file.createdAt).fromNow() },
        },
        revalidate: 60,
    };
}

export async function getStaticPaths() {
    const file = await prisma.file.findMany();

    const paths = file.map((f) => ({ params: { fileID: f.fileID } }));

    return { paths, fallback: "blocking" };
}
