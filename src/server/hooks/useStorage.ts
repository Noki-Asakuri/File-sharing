import { Dispatch, useCallback, useEffect, useRef } from "react";

import { supabase } from "@/server/db/supabase";
import { ActionType, State } from "@/pages";

import genID from "@/utils/genID";
import { trpc } from "@/utils/trpc";

type storageType = { state: State; dispatch: Dispatch<ActionType> };

const useStorage = ({ state, dispatch }: storageType) => {
    const uploadPassword = useRef<string | null>(null);
    const {
        mutateAsync: uploadFile,
        data: uploadedFile,
        isSuccess,
    } = trpc.useMutation(["upload.file"], {
        onError: ({ message }) => {
            dispatch({ type: "ERROR", payload: message });
        },
    });
    const { isUploading, file, password } = state;

    const uploadFileToStorage = useCallback(
        async (file: File) => {
            const { fileID, path } = genID(file.name);

            await Promise.all([
                supabase.upload(path, file, { contentType: file.type, cacheControl: "3600" }),
                uploadFile({
                    fileID: fileID,
                    path: path,
                    name: file.name,
                    type: file.type,
                    password: password.current!.value,
                }),
            ]);

            uploadPassword.current = password.current?.value.length ? password.current.value : null;

            dispatch({ type: "UPLOADED" });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [file],
    );

    useEffect(() => {
        if (isUploading) {
            uploadFileToStorage(file);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading]);

    if (isSuccess) {
        return { ...uploadedFile, password: uploadPassword.current };
    }
};

export type returnFile = ReturnType<typeof useStorage>;
export default useStorage;
