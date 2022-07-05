import type { NextPage } from "next";

import React, { useEffect, useState } from "react";
import {
    FaEye,
    FaEyeSlash,
    FaClipboard,
    FaClipboardCheck,
} from "react-icons/fa";

import CopytoClipboardToast from "@/components/Toast";
import Image from "next/future/image";
import { trpc } from "@/utils/trpc";
import { encode } from "base64-arraybuffer";
import getBaseUrl from "@/utils/getBaseUrl";

interface UploadFile {
    name: string;
    type: string;
    password?: string;
}

const Home: NextPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const [isUploading, setUploading] = useState<boolean>(false);
    const [popup, setPopup] = useState<boolean>(false);

    const fileMutation = trpc.useMutation("file.upload-file");

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let selected = e.target.files![0];

        if (selected && selected.size < 52428800) {
            setFile(selected);
            setError("");
        } else {
            setFile(null);
            setError("File over 50mb limit!");
        }
    };

    const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        if (!file) {
            return;
        }

        let mutateData: UploadFile = {
            name: file.name,
            type: file.type,
        };

        if (password.length > 0) {
            mutateData = { ...mutateData, password: password };
        }

        file.arrayBuffer().then((data) => {
            fileMutation.mutate({
                ...mutateData,
                fileBuffer: encode(data),
            });
        });
    };

    const showPasswordHandler = (e: React.FormEvent) => {
        e.preventDefault();

        setShowPassword((current) => !current);
    };

    const copyToClipboard = (text: string | undefined) => {
        if (fileMutation.data && text) {
            setPopup(true);
            navigator.clipboard.writeText(text);

            setTimeout(() => {
                setPopup(false);
            }, 2000);
        }
    };

    useEffect(() => {
        if (fileMutation.data) {
            setUploading(false);
        }
    }, [fileMutation.data]);

    return (
        <div className="max-w-7xl mx-auto my-0">
            <div>
                <h1 className="tracking-widest font-normal text-3xl text-blue-500">
                    Freunds
                </h1>
                <h2 className="mt-16 text-4xl text-center">File Sharing</h2>
                <p className="text-center pt-5">
                    A simple file sharing website so i don&apos;t need to
                    fucking host the fucking file on fucking google drive each
                    time i need to fucking share a file though discord without a
                    bs 8mb limit.
                </p>
            </div>

            <div className="flex justify-around flex-wrap pt-20 gap-y-10">
                <form className="flex flex-col gap-y-7 items-start relative max-w-max p-10 rounded-2xl bg-slate-800 h-[300px]">
                    <span className="w-full flex justify-center text-2xl">
                        Upload Form
                    </span>
                    <label htmlFor="file">
                        File:{" "}
                        <span className="bg-slate-700 py-2 px-4 rounded-2xl">
                            {file?.name || "None"}
                        </span>
                    </label>
                    <input
                        className="hidden"
                        type="file"
                        id="file"
                        name="file"
                        onChange={changeHandler}
                        required
                    />
                    <div className="max-w-max flex justify-center items-center gap-x-4">
                        <label htmlFor="password">Password: </label>

                        <input
                            className="bg-slate-700 rounded-2xl px-4 py-2 focus:outline-none"
                            type={showPassword ? "password" : "text"}
                            name="password"
                            id="password"
                            onChange={passwordHandler}
                        />
                        <button
                            aria-label="toggle password display"
                            onClick={showPasswordHandler}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        className="bg-slate-700 py-2 w-full rounded-2xl h-[40px]"
                        onClick={submitHandler}
                    >
                        {!isUploading ? (
                            "Submit"
                        ) : (
                            <Image
                                className="flex justify-center items-center h-7 w-full"
                                src="/uploading.svg"
                                alt="Uploading images"
                            />
                        )}
                    </button>
                    {error && (
                        <div className="absolute left-[200px] top-[95px]">
                            <span className="text-sm text-red-600">
                                {error}
                            </span>
                        </div>
                    )}
                </form>

                <div className="flex flex-col gap-y-7 items-start p-10 rounded-2xl bg-slate-800 w-[455px] mb-40 h-[300px]">
                    <span className="w-full flex justify-center text-2xl ">
                        File Uploaded
                    </span>
                    <ul className="flex flex-col gap-y-2">
                        <li>
                            ID:{" "}
                            <span className="text-sm">
                                {fileMutation.data?.id || "None"}
                            </span>
                        </li>
                        <li>
                            Name:{" "}
                            <span className="text-sm">
                                {fileMutation.data?.name ||
                                    file?.name ||
                                    "None"}
                            </span>
                        </li>
                        <li>
                            Password:{" "}
                            <span className="text-sm">
                                {password || "None"}
                            </span>
                        </li>
                        <li>
                            Url:{" "}
                            <CopytoClipboardToast
                                Popup={popup}
                                setPopup={setPopup}
                            >
                                <button className="text-ellipsis whitespace-nowrap overflow-hidden max-w-[280px] cursor-default">
                                    {fileMutation.data?.url || "None"}
                                </button>
                                {fileMutation.data && fileMutation.data.url && (
                                    <button
                                        className="pl-2"
                                        onClick={() =>
                                            copyToClipboard(
                                                fileMutation.data?.url
                                            )
                                        }
                                    >
                                        {!popup ? (
                                            <FaClipboard />
                                        ) : (
                                            <FaClipboardCheck />
                                        )}
                                    </button>
                                )}
                            </CopytoClipboardToast>
                        </li>

                        {/* TODO: Move this somewhere else. */}
                        {fileMutation.data?.error && (
                            <li>Error: {fileMutation.data.error.message} </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
