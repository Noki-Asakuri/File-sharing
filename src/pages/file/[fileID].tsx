import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { trpc } from "@/utils/trpc";
import Image from "next/future/image";
import download from "@/utils/download";

const FileDownload: React.FC = () => {
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const [isUploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { refetch } = trpc.useQuery([
        "file.get-file",
        { id: router.query.fileID as string },
    ]);
    const passwordMutation = trpc.useMutation("file.password-check");

    const showPasswordHandler = (e: React.FormEvent) => {
        e.preventDefault();

        setShowPassword((current) => !current);
    };

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        if (!password) {
            return;
        }

        passwordMutation.mutate({
            id: router.query.fileID as string,
            password: password,
        });
    };

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        refetch().then((refetchQuery) => {
            if (!refetchQuery.data) {
                return;
            }
            if (refetchQuery.data.error) {
                setError(refetchQuery.data.error);

                setTimeout(() => {
                    router.push("/");
                }, 3000);

                return;
            }
            const { passwordLock } = refetchQuery.data;

            if (!passwordLock) {
                // No password provided! Downloading ...
                download(
                    refetchQuery.data.url as string,
                    refetchQuery.data.name as string
                );
            } else {
                if (!passwordMutation.data) {
                    return;
                }

                if (passwordMutation.data.error) {
                    setError(passwordMutation.data.error);
                    setUploading(false);
                    return;
                }

                if (passwordMutation.data.download) {
                    // Password is correct. Downloading...
                    download(
                        refetchQuery.data.url as string,
                        refetchQuery.data.name as string
                    );

                    setError(null);
                }
            }

            setUploading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [passwordMutation.data, router.isReady]);

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="flex flex-col gap-y-7 items-start relative max-w-max p-10 rounded-2xl bg-slate-800">
                <span className="w-full flex justify-center text-2xl">
                    Password
                </span>
                <div className="max-w-max flex justify-center items-center gap-x-4">
                    <label htmlFor="password">Password: </label>
                    <input
                        className="bg-slate-700 rounded-2xl px-4 py-2 focus:outline-none"
                        type={showPassword ? "password" : "text"}
                        name="password"
                        id="password"
                        onChange={passwordHandler}
                    />
                    <button aria-label="toggle password display" onClick={showPasswordHandler}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button
                    className="bg-slate-700 py-2 w-full rounded-2xl h-[40px]"
                    onClick={submitHandler}
                >
                    {!isUploading ? (
                        "Download"
                    ) : (
                        <Image
                            className="flex justify-center items-center h-7 w-full"
                            src="/uploading.svg"
                            alt="Uploading images"
                        />
                    )}
                </button>
                {error && (
                    <div className="">
                        <span className="text-sm text-red-600">{error}</span>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FileDownload;
