import download from "@/utils/download";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { prisma } from "@/server/db/client";
import { trpc } from "@/utils/trpc";

type PrismaFile = {
    id: string;
    name: string;
    password?: string;
    fileUrl: string;
    type: string;
    path: string;
    downloadCount: number;
};

const PasswordForm: React.FC<{
    filePassword: string;
    setPasswordLocked: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ filePassword, setPasswordLocked }) => {
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const passwordCheck = trpc.useMutation(["file.password-check"]);

    const handleSubmitPassword = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();

        passwordCheck.mutate({
            filePassword,
            inputPassword: password,
        });
    };

    useEffect(() => {
        if (!passwordCheck.data) {
            return;
        }

        if (passwordCheck.data.download) {
            setPasswordLocked(false);
        } else {
            setError(passwordCheck.data.error || "");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [passwordCheck.data]);

    return (
        <form className="flex flex-col gap-y-7 items-start relative max-w-max p-10 rounded-2xl bg-slate-800">
            <div className="w-full flex justify-center text-2xl">Password</div>
            <div className="max-w-max flex justify-center items-center gap-x-4">
                <input
                    className="bg-slate-700 rounded-2xl px-4 py-2 focus:outline-none"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="bg-slate-700 p-3 rounded-xl"
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
                onClick={handleSubmitPassword}
            >
                Download
            </button>
            {error && (
                <div className="">
                    <span className="text-sm text-red-600">{error}</span>
                </div>
            )}
        </form>
    );
};

const FileDownload: React.FC<{ fileInfo: PrismaFile | null }> = ({
    fileInfo,
}) => {
    const [file] = useState<PrismaFile | null>(fileInfo);
    const [passwordLocked, setPasswordLocked] = useState<boolean>(false);
    const router = useRouter();

    const downloadFile = () => {
        if (!file) {
            return;
        }

        download(file.fileUrl, file.name);
    };

    useEffect(() => {
        if (!file) {
            setTimeout(() => router.push("/"), 3000);
        } else {
            setPasswordLocked(file.password !== null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head>
                <title>{`File: ${file && file.name}`}</title>
                <meta
                    property="og:title"
                    content={`File: ${file && file.name}.`}
                />
            </Head>
            {!file && (
                <div className="flex w-full h-screen justify-center items-center">
                    <h1 className="text-xl text-red-500">
                        Error 404: No page found. Redirecting ...
                    </h1>
                </div>
            )}
            {file && (
                <div className="flex justify-center items-center h-screen">
                    {passwordLocked ? (
                        <PasswordForm
                            filePassword={file.password as string}
                            setPasswordLocked={setPasswordLocked}
                        />
                    ) : (
                        <div className="flex flex-col gap-y-7 items-start relative max-w-max p-10 rounded-2xl bg-slate-800">
                            <button
                                className="bg-slate-700 py-2 px-4 w-full rounded-2xl h-[40px]"
                                onClick={() => {
                                    downloadFile();
                                }}
                            >
                                Click to download
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FileDownload;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const file = await prisma.file.findFirst({
        where: { id: context.query.fileID as string },
    });

    if (!file) {
        return {
            props: {
                fileInfo: null,
            },
        };
    }

    return {
        props: { fileInfo: { ...file } },
    };
}
