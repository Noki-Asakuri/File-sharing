import dynamic from "next/dynamic";
import { Reducer, RefObject, Suspense, useReducer, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import LoadingImage from "$lib/components/Svg/Loading";
import { useStorage } from "$lib/server/hooks";

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

            toast.error("File size over 50MB limit!");
            return { ...state, isUploading: false, file: null };

        case "SUBMIT":
            if (!state.file) {
                toast.error("No file to upload!");

                return { ...state, isUploading: false };
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

            toast.error(payload);
            return { ...state, isUploading: false, file: null };

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
            <div className="flex w-full flex-wrap justify-around gap-10 pt-20">
                <UploadForm {...{ state, dispatch }} />
                <UploadInfo {...{ uploadedFile }} />
            </div>
            <Toaster
                toastOptions={{
                    style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
                }}
            />
        </Suspense>
    );
};

export default Upload;
