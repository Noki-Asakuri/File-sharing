import type { GetStaticPropsContext, NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import {
    FaArrowAltCircleDown,
    FaCheckCircle,
    FaEye,
    FaEyeSlash,
    FaIdCard,
    FaLock,
    FaSignInAlt,
    FaTimesCircle,
    FaUpload,
    FaUserTie,
} from "react-icons/fa";

import SpinningCircle from "@/components/Svg/SpinningCircle";
import { prisma } from "@/server/db/client";
import { trpc } from "@/utils/trpc";
import createDownload from "@/utils/download";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface PasswordFormType {
    fileID: string;
    password: string;
    setLocked: (value: boolean) => void;
}

const PasswordForm: React.FC<PasswordFormType> = ({ fileID, password, setLocked }) => {
    const inputPasswordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { mutate: checkPass, isLoading } = trpc.useMutation(["check.password"], {
        onSuccess: ({ download }) => {
            if (download) {
                setLocked(false);
                toast.success("Access granted!", {
                    duration: 2000,
                    style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
                    iconTheme: { primary: "#15803d", secondary: "#262626" },
                });
            }
        },
        onError: ({ message }) => {
            toast.error(message, {
                style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
            });
        },
    });

    return (
        <form
            className="flex flex-col gap-y-7 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 p-10"
            onSubmit={(e) => {
                e.preventDefault();
                checkPass({ fileID, password, inputPassword: inputPasswordRef.current!.value });
            }}
        >
            <div className="flex w-full items-center justify-center gap-2 text-2xl">
                <FaLock /> Locked
            </div>
            <div className="flex max-w-max items-center justify-center gap-x-2">
                <label htmlFor="password">Password:</label>
                <div className="flex items-center justify-center rounded-2xl bg-slate-700">
                    <input
                        className="ml-4 bg-inherit py-2 placeholder:text-xs focus:outline-none"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Enter password to access!"
                        ref={inputPasswordRef}
                    />
                    <button
                        className="px-4"
                        aria-label="toggle password display"
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
            </div>

            <button className="flex justify-center rounded-2xl bg-slate-700 py-2" type="submit">
                {!isLoading ? "Submit" : <SpinningCircle />}
            </button>
        </form>
    );
};

type StaticProps = NonNullable<Awaited<ReturnType<typeof getStaticProps>>["props"]>;

const FileDownload: NextPage<StaticProps> = ({ file, author }) => {
    const { data: session, status } = useSession();

    const [Locked, setLocked] = useState<boolean>(true);
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<{ tab: "File" | "User"; page?: string }>({
        tab: "File",
    });

    const updateTab = (tab: "File" | "User") => {
        let page = tab === "File" ? "" : "translate-x-[126px]";

        return setActiveTab({ tab, page });
    };

    const { mutate: download } = trpc.useMutation(["file.download-file"], {
        onMutate: () => {
            setIsDownload(true);
        },
        onSuccess: ({ downloadUrl }) => {
            createDownload(file.name, downloadUrl);
        },
        onSettled: () => {
            setIsDownload(false);
        },
    });

    useEffect(() => {
        if (status !== "loading" && session) {
            setLocked(!!file.password && !file.unlockedUser.includes(session.user.discordID!));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, session]);

    return (
        <>
            <Head>
                <title>{file.name}</title>
                <meta property="og:title" content={`File Sharing.`} />
                <meta property="og:site_name" content={file.author} />
                <meta
                    property="og:description"
                    content={`File: ${file.name}\nDownload: ${file.downloadCount}\nUpload ${file.createdAt}`}
                />
                <meta property="og:image" content={author.image} />
            </Head>

            {status !== "loading" && (
                <article className="flex h-screen items-center justify-center">
                    {Locked && file.password && (
                        <PasswordForm
                            password={file.password}
                            setLocked={setLocked}
                            fileID={file.fileID}
                        />
                    )}

                    {!Locked && (
                        <div className="h-[400px] w-[500px] rounded-2xl bg-gradient-to-br from-gray-700 to-slate-900">
                            <div className="flex w-full items-center justify-between px-7 pt-7">
                                <div className="flex flex-col justify-center">
                                    <Image
                                        className="rounded-full"
                                        src={`${author.image}?size=1024`}
                                        alt="Discord Avatar"
                                        width="130"
                                        height="130"
                                    />
                                    <div className="py-2 text-lg">
                                        <span className="font-bold text-white">{author.name}</span>
                                        <span className="text-gray-400">
                                            {author.discriminator}
                                        </span>
                                        {session?.user.discordID === author.discordID && (
                                            <span className="text-xs text-gray-500">
                                                {" (You)"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="h-11 w-44 rounded-md bg-gradient-to-bl from-green-600 to-green-800 px-4 py-2"
                                        onClick={() => download({ fileID: file.fileID })}
                                    >
                                        {isDownload ? (
                                            <span className="flex items-center gap-2">
                                                Downloading <SpinningCircle />
                                            </span>
                                        ) : (
                                            <span>Download</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="relative flex gap-7 px-7">
                                    <button className="w-24 py-2" onClick={() => updateTab("File")}>
                                        File Info
                                    </button>
                                    <button className="w-24 py-2" onClick={() => updateTab("User")}>
                                        User Info
                                    </button>
                                    <div
                                        className={`absolute bottom-0 w-24 border-b-2 border-white transition-transform ${activeTab.page}`}
                                    />
                                </div>

                                <div className="w-full border-t-2 border-t-gray-600 opacity-60" />
                                <div>
                                    {activeTab.tab === "File" && (
                                        <div className="flex max-w-max flex-col gap-3 p-7">
                                            <span className="flex items-center justify-start gap-2">
                                                <FaIdCard />
                                                Name: {file.name}
                                            </span>
                                            <span className="flex items-center justify-start gap-2">
                                                <FaArrowAltCircleDown />
                                                Downloaded: {file.downloadCount}
                                            </span>
                                            <div className="group relative max-w-max">
                                                <span className="flex items-center justify-start gap-2">
                                                    <FaUpload />
                                                    Uploaded {file.relativeTime}
                                                </span>
                                                <span className="absolute -top-2 left-[110%] w-max scale-0 rounded-md bg-[#18191c] py-2 px-3 text-sm transition-all group-hover:scale-100">
                                                    <div className="arrow absolute top-[40%] -left-2 h-2 w-2 bg-inherit" />
                                                    {file.createdAt}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {activeTab.tab === "User" && (
                                        <div className="flex flex-col gap-3 p-7">
                                            <span className="flex items-center justify-start gap-2">
                                                <FaIdCard />
                                                Name: {author.fullName}
                                            </span>
                                            <span className="flex items-center justify-start gap-2">
                                                <FaUserTie />
                                                Admin:{" "}
                                                {author.isAdmin ? (
                                                    <FaCheckCircle className="text-green-500" />
                                                ) : (
                                                    <FaTimesCircle className="text-red-500" />
                                                )}
                                            </span>
                                            <div className="group relative w-max">
                                                <span className="flex items-center justify-start gap-2">
                                                    <FaSignInAlt />
                                                    Joined {author.relativeTime}
                                                </span>
                                                <span className="absolute -top-2 left-[110%] w-max scale-0 rounded-md bg-[#18191c] py-2 px-3 text-sm transition-all group-hover:scale-100">
                                                    <div className="arrow absolute top-[40%] -left-2 h-2 w-2 bg-inherit" />
                                                    {author.joinDate}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <Toaster />
                </article>
            )}
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
        select: {
            createdAt: true,
            authorID: true,
            downloadCount: true,
            name: true,
            fileID: true,
            password: true,
            author: true,
            unlockedUser: true,
        },
    });

    if (!file) return { notFound: true };

    const author = await prisma.user.findFirstOrThrow({
        where: { discordID: file.authorID },
        select: { name: true, joinDate: true, image: true, isAdmin: true, discordID: true },
    });

    const dayjsFile = dayjs(file.createdAt);
    const dayjsAuthor = dayjs(author.joinDate);

    return {
        props: {
            file: {
                ...file,
                relativeTime: dayjsFile.fromNow(),
                createdAt: dayjsFile.format("MM-DD-YYYY, hh:mm:ss A"),
            },
            author: {
                name: author.name?.split("#")[0]!,
                discriminator: "#" + author.name?.split("#")[1]!,
                fullName: author.name!,
                discordID: author.discordID,
                image: author.image!,
                isAdmin: author.isAdmin,
                relativeTime: dayjsAuthor.fromNow(),
                joinDate: dayjsAuthor.format("MM-DD-YYYY, hh:mm:ss A"),
            },
        },
        revalidate: 300,
    };
}

export async function getStaticPaths() {
    const file = await prisma.file.findMany({ select: { fileID: true } });
    const paths = file.map(({ fileID }) => ({ params: { fileID } }));

    return { paths, fallback: "blocking" };
}
