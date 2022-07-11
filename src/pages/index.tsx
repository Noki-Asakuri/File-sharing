import type { NextPage } from "next";

import React, { Reducer, useEffect, useReducer } from "react";

import useStorage from "@/server/hooks/useStorage";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
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
    payload:
        | React.ChangeEvent<HTMLInputElement>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | null;
}

export interface State {
    file: File | null;
    password: string;
    error: string | null;
    isUploading: boolean;
}

function instanceOfChangeEvent(
    object: any
): object is React.ChangeEvent<HTMLInputElement> {
    return "files" in object.target;
}

const reducer = (state: State, action: ActionType) => {
    const { type, payload } = action;

    switch (type) {
        case Action.CHANGE:
            if (!payload || !instanceOfChangeEvent(payload)) {
                return state;
            }
            let selected = payload.target.files![0];

            if (selected && selected.size < 52428800) {
                return {
                    ...state,
                    file: selected,
                    error: null,
                };
            }
            return {
                ...state,
                file: null,
                error: "File size over 50mb limit!",
            };

        case Action.PASSWORD:
            if (!payload || !instanceOfChangeEvent(payload)) {
                return state;
            }

            return { ...state, password: payload.target.value };
        case Action.SUBMIT:
            if (!payload || instanceOfChangeEvent(payload)) {
                return state;
            }
            payload.preventDefault();

            if (!state.file) {
                return { ...state, error: "No file to upload!" };
            }

            return { ...state, isUploading: true };

        case Action.UPLOADED:
            if (payload) {
                return state;
            }

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

    const uploadFile = useStorage({
        file: state.file,
        isUploading: state.isUploading,
        password: state.password,
    });

    useEffect(() => {
        if (uploadFile) {
            dispatch({ type: Action.UPLOADED, payload: null });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadFile]);

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
            <div className="max-w-7xl mx-auto my-0 h-screen">
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
                    <Suspense fallback={"Loading..."}>
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
