import type { NextPage } from "next";

import { Reducer, RefObject, useReducer, useRef } from "react";

import useStorage from "@/server/hooks/useStorage";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/future/image";
import Head from "next/head";
import { Suspense } from "react";

import { Toaster } from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";

const UploadInfo = dynamic(() => import("@/components/UploadInfo"), { suspense: true, ssr: false });
const UploadForm = dynamic(() => import("@/components/UploadForm"), { suspense: true, ssr: false });

export interface ActionType {
    type: "SUBMIT" | "PASSWORD" | "CHANGE" | "UPLOADED" | "ERROR";
    payload?: File | string | null;
}

interface BaseState {
    password: RefObject<HTMLInputElement>;
    error: string | null;
    isUploading: boolean;
    file: File | null;
}

interface ChangeState extends BaseState {
    isUploading: false;
    file: File;
}

interface UploadState extends BaseState {
    isUploading: false;
    file: null;
}

interface UploadedState extends BaseState {
    isUploading: true;
    file: File;
}

export type State = ChangeState | UploadState | UploadedState;

const reducer = (state: State, action: ActionType): State => {
    const { type, payload } = action;

    switch (type) {
        case "CHANGE":
            if (!payload || typeof payload === "string") {
                return state;
            }

            if (payload.size < 52428800) {
                return { ...state, file: payload, error: null };
            }
            return {
                ...state,
                isUploading: false,
                file: null,
                error: "File size over 50MB limit!",
            };

        case "SUBMIT":
            if (!state.file) {
                return {
                    ...state,
                    isUploading: false,
                    error: "No file to upload!",
                };
            }

            return { ...state, isUploading: true, error: null };

        case "UPLOADED":
            state.isUploading = false;
            state.password.current!.value = "";

            return state;

        case "ERROR":
            if (typeof payload !== "string") {
                return state;
            }

            return { ...state, isUploading: false, error: payload, file: null };

        default:
            return state;
    }
};

const Home: NextPage = () => {
    const { data: session } = useSession();

    const passwordRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer<Reducer<State, ActionType>>(reducer, {
        file: null,
        password: passwordRef,
        error: null,
        isUploading: false,
    });

    const uploadFile = useStorage({ state, dispatch });

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
            <div className={`container ${session ? "h-full" : "h-screen"} mx-auto lg:h-screen`}>
                <header className="pt-28">
                    <h2 className="text-4xl text-center ">File Sharing</h2>
                    <p className="max-w-2xl pt-5 m-auto text-center">
                        A simple file-sharing website so I don&apos;t need to fucking host the
                        fucking file on fucking google drive each time I need to fucking share a
                        file through discord without a bullshit 8MB limit.
                    </p>
                </header>

                {!session && (
                    <div className="flex flex-wrap justify-around gap-10 pt-20 h-80">
                        <div className="relative flex flex-col items-start p-10 gap-y-7 max-w-max rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 drop-shadow-lg">
                            <h2 className="flex items-center justify-center w-full gap-2 pb-6 text-4xl text-red-500">
                                <FaExclamationTriangle />
                                Error 401
                            </h2>
                            <span className="flex items-center justify-center">
                                You need to login before you can upload file.
                            </span>
                        </div>
                    </div>
                )}

                {session && (
                    <Suspense
                        fallback={
                            <div className="flex justify-center items-center h-[300px] w-full">
                                <Image
                                    width="100"
                                    height="100"
                                    src={"/loading.svg"}
                                    alt={"Loading image"}
                                />
                            </div>
                        }
                    >
                        <div className="flex flex-wrap justify-around gap-10 pt-20">
                            <UploadForm state={state} dispatch={dispatch} />
                            <UploadInfo uploadFile={uploadFile} />
                        </div>
                        <Toaster />
                    </Suspense>
                )}

                <footer className="relative bottom-0 flex flex-col items-center justify-center my-20 gap-y-3">
                    <span className="text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-rainbow-text animate-rainbow">
                        Made by Asakuri#8323
                    </span>
                </footer>
            </div>
        </>
    );
};

export default Home;
