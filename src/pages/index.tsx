import type { NextPage } from "next";

import { MutableRefObject, Reducer, useReducer, useRef } from "react";

import useStorage from "@/server/hooks/useStorage";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/future/image";
import Head from "next/head";
import { Suspense } from "react";

const UploadedFile = dynamic(() => import("@/components/UploadedFile"), {
    suspense: true,
});
const UploadForm = dynamic(() => import("@/components/UploadForm"), {
    suspense: true,
});

export interface ActionType {
    type: "SUBMIT" | "PASSWORD" | "CHANGE" | "UPLOADED" | "ERROR";
    payload?: File | string | null | undefined;
}

export interface State {
    file: File | null;
    password: MutableRefObject<string>;
    error: string | null;
    isUploading: boolean;
}

const reducer = (state: State, action: ActionType): State => {
    const { type, payload } = action;

    switch (type) {
        case "CHANGE":
            if (!payload || typeof payload === "string") {
                return state;
            }

            if (payload.size < 52428800) {
                return {
                    ...state,
                    file: payload,
                    error: null,
                };
            }
            return {
                ...state,
                file: null,
                error: "File size over 50MB limit!",
            };

        case "PASSWORD":
            if (!payload || typeof payload !== "string") {
                return state;
            }

            state.password.current = payload;
            return state;

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
            return { ...state, isUploading: false };

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

    const passwordRef = useRef("");

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
            <div className="mx-auto my-0 max-w-7xl h-max">
                <header>
                    <h2 className="mt-16 text-4xl text-center">File Sharing</h2>
                    <p className="max-w-2xl pt-5 m-auto text-center">
                        A simple file-sharing website so I don&apos;t need to
                        fucking host the fucking file on fucking google drive
                        each time I need to fucking share a file through discord
                        without a bullshit 8MB limit.
                    </p>
                </header>

                {!session && (
                    <div className="flex flex-wrap justify-around gap-10 pt-20">
                        <div className="relative flex flex-col items-start p-10 gap-y-7 max-w-max rounded-2xl bg-slate-800">
                            <span className="flex justify-center w-full text-2xl">
                                Error
                            </span>
                            <span>
                                You need to login before you can share file.
                            </span>
                        </div>
                    </div>
                )}

                {session && (
                    <Suspense
                        fallback={
                            <div className="flex justify-center items-center h-[300px] w-full">
                                <Image width="100px" height="100px" src={"/loading.svg"} alt={"Loading image"} />
                            </div>
                        }
                    >
                        <div className="flex flex-wrap justify-around gap-10 pt-20">
                            <UploadForm state={state} dispatch={dispatch} />
                            <UploadedFile uploadFile={uploadFile} />
                        </div>
                    </Suspense>
                )}

                <footer className="relative bottom-0 flex items-center justify-center my-20">
                    <span>Made by Asakuri#8323</span>
                </footer>
            </div>
        </>
    );
};

export default Home;
