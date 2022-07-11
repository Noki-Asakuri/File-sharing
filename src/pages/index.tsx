import type { NextPage } from "next";

import { Reducer, useEffect, useReducer, useRef } from "react";

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

export enum Action {
    SUBMIT = "SUBMIT-HANDLER",
    PASSWORD = "PASSWORD-HANDLER",
    CHANGE = "ON-CHANGE-HANDLER",
    UPLOADED = "UPLOADED",
}

export interface ActionType {
    type: Action;
    payload?: File | string | null | undefined;
}

export interface State {
    file: File | null;
    password: string;
    error: string | null;
    isUploading: boolean;
}

const reducer = (state: State, action: ActionType): State => {
    const { type, payload } = action;

    switch (type) {
        case Action.CHANGE:
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

        case Action.PASSWORD:
            if (!payload || typeof payload !== "string") {
                return state;
            }

            return { ...state, password: payload };

        case Action.SUBMIT:
            if (!state.file) {
                return {
                    ...state,
                    isUploading: false,
                    error: "No file to upload!",
                };
            }

            return { ...state, isUploading: true, error: null };

        case Action.UPLOADED:
            return { ...state, isUploading: false };

        default:
            return state;
    }
};

const Home: NextPage = () => {
    const { data: session } = useSession();

    const [state, dispatch] = useReducer<Reducer<State, ActionType>>(reducer, {
        file: null,
        password: "",
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
            <div className="max-w-7xl mx-auto my-0 h-max">
                <header>
                    <h2 className="mt-16 text-4xl text-center">File Sharing</h2>
                    <p className="text-center pt-5 max-w-2xl m-auto">
                        A simple file-sharing website so I don&apos;t need to
                        fucking host the fucking file on fucking google drive
                        each time I need to fucking share a file through discord
                        without a bullshit 8MB limit.
                    </p>
                </header>

                {!session && (
                    <div className="flex justify-around flex-wrap pt-20 gap-10">
                        <div className="flex flex-col gap-y-7 items-start relative max-w-max p-10 rounded-2xl bg-slate-800">
                            <span className="w-full flex justify-center text-2xl">
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
                                <Image
                                    width="100px"
                                    height="100px"
                                    src={"/loading.svg"}
                                    alt={"Loading image"}
                                />
                            </div>
                        }
                    >
                        <div className="flex justify-around flex-wrap pt-20 gap-10">
                            <UploadForm state={state} dispatch={dispatch} />

                            <UploadedFile uploadFile={uploadFile} />
                        </div>
                    </Suspense>
                )}

                <footer className="relative my-20 bottom-0 flex justify-center items-center">
                    <span>Made by Freunds#8323</span>
                </footer>
            </div>
        </>
    );
};

export default Home;
