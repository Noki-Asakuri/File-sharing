import { useStorage } from "@/server/hooks";
import dynamic from "next/dynamic";
import { Reducer, RefObject, Suspense, useReducer, useRef } from "react";
import { Toaster } from "react-hot-toast";

import LoadingImage from "../Svg/Loading";

const UploadInfo = dynamic(() => import("./UploadInfo"), { ssr: false });
const UploadForm = dynamic(() => import("./UploadForm"), { ssr: false });

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
            if (!state.password.current) return state;

            state.isUploading = false;
            state.password.current.value = "";

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

const Upload: React.FC = () => {
    const passwordRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer<Reducer<State, ActionType>>(reducer, {
        file: null,
        password: passwordRef,
        error: null,
        isUploading: false,
    });

    const uploadedFile = useStorage({ state, dispatch });

    return (
        <Suspense
            fallback={
                <div className="flex h-[300px] w-full items-center justify-center">
                    <LoadingImage />
                </div>
            }
        >
            <div className="flex flex-wrap justify-around gap-10 pt-20">
                <UploadForm state={state} dispatch={dispatch} />
                <UploadInfo uploadFile={uploadedFile} />
            </div>
            <Toaster />
        </Suspense>
    );
};

export default Upload;
