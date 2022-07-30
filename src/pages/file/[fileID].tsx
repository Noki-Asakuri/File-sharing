import download from "@/utils/download";
import type { NextPage } from "next";
import { GetStaticPropsContext } from "next";
import Image from "next/future/image";
import Head from "next/head";
import React, { useCallback, useState } from "react";
import {
    FaArrowAltCircleDown,
    FaEye,
    FaEyeSlash,
    FaIdCard,
    FaLock,
    FaUpload,
} from "react-icons/fa";

import SpinningCircle from "@/components/SpinningCircle";
import { prisma } from "@/server/db/client";
import { trpc } from "@/utils/trpc";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast, { Toaster } from "react-hot-toast";

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
        onError: ({ message }) => {
            toast.error(message, {
                style: {
                    borderRadius: "10px",
                    background: "#262626",
                    color: "#E8DCFF",
                },
            });
        },
    });

    return (
        <form
            className="relative flex flex-col items-start p-10 gap-y-7 max-w-max rounded-2xl bg-slate-800"
            onSubmit={(e) => {
                e.preventDefault();

                passwordCheck.mutate({
                    filePassword,
                    inputPassword: password,
                });
            }}
        >
            <div className="flex items-center justify-center w-full gap-2 text-2xl">
                <FaLock />
                Locked
            </div>
            <div className="flex items-center justify-center max-w-max gap-x-4">
                <label htmlFor="password">Password:</label>
                <input
                    required
                    className="px-4 py-2 bg-slate-700 rounded-2xl focus:outline-none placeholder:text-xs"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter password to access!"
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

            <input
                className="bg-slate-700 py-2 px-4 w-full rounded-2xl h-[40px] cursor-pointer"
                type="submit"
                value="Download"
            />
            <Toaster />
        </form>
    );
};

type StaticProps = NonNullable<
    Awaited<ReturnType<typeof getStaticProps>>["props"]
>;

const FileDownload: NextPage<StaticProps> = ({ file, author }) => {
    const [passwordLocked, setPasswordLocked] = useState<boolean>(
        file.password !== null
    );
    const [isDownload, setIsDownload] = useState<boolean>(false);

    const { mutate: updateDownload } = trpc.useMutation([
        "file.update-download-count",
    ]);

    const downloadFile = useCallback(() => {
        download(file.url, file.name);
        updateDownload({ id: file.fileID });
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
                    <div className="relative flex flex-col items-start rounded-2xl bg-gray-800 bg-opacity-75 w-[600px] h-max">
                        <div className="flex items-center justify-between w-full pt-7 px-7">
                            <div className="flex flex-col justify-center">
                                <Image
                                    className="rounded-full w-[120px] h-[120px]"
                                    src={author.image as string}
                                    alt="Author discord avatar"
                                />
                                <div className="pt-3 pb-2 text-lg">
                                    <span className="font-bold text-white">
                                        {author.name}
                                    </span>
                                    <span className="text-gray-400">
                                        {author.discriminator}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="bg-green-700 py-2 px-4 w-[170px] rounded-md h-[40px]"
                                    onClick={() => {
                                        setIsDownload(true);
                                        downloadFile();
                                        setTimeout(() => {
                                            setIsDownload(false);
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
                                            <span>Download</span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-full">
                            <div className="py-2 border-b-2 border-b-white mx-7 w-max">
                                File Info
                            </div>
                            <div className="w-full border-t-2 border-t-gray-600 opacity-60" />
                            <div className="flex flex-col gap-3 p-7 max-w-max">
                                <span className="flex items-center justify-start gap-2">
                                    <FaIdCard />
                                    Name: {file.name}
                                </span>
                                <span className="flex items-center justify-start gap-2">
                                    <FaArrowAltCircleDown />
                                    Downloaded: {file.downloadCount}
                                </span>
                                <div className="relative group max-w-max">
                                    <span className="flex items-center justify-start gap-2">
                                        <FaUpload />
                                        Uploaded {file.relativeTime}
                                    </span>
                                    <span className="absolute -top-2 left-[110%] scale-0 text-sm group-hover:scale-100 w-max bg-[#18191c] py-2 px-3 rounded-md transition-all">
                                        <div className="absolute w-2 h-2 bg-inherit arrow top-[40%] -left-2" />
                                        {file.createdAt}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FileDownload;

export async function getStaticProps(ctx: GetStaticPropsContext) {
    if (!ctx.params || typeof ctx.params.fileID !== "string") {
        return { notFound: true };
    }

    const file = await prisma.file.findFirst({
        where: { fileID: ctx.params.fileID },
    });

    if (!file) {
        return { notFound: true };
    }

    const author = await prisma.user.findFirstOrThrow({
        where: { discordID: file.authorID },
    });

    return {
        props: {
            file: {
                ...file,
                relativeTime: dayjs(file.createdAt).fromNow(),
                createdAt: dayjs(file.createdAt).format("M-D-YYYY, hh:mm:ss A"),
            },
            author: {
                name: author.name?.split("#")[0] as string,
                discriminator: ("#" + author.name?.split("#")[1]) as string,
                image: author.image as string,
            },
        },
        revalidate: 60,
    };
}

export async function getStaticPaths() {
    const file = await prisma.file.findMany();

    const paths = file.map((f) => ({ params: { fileID: f.fileID } }));

    return { paths, fallback: "blocking" };
}
