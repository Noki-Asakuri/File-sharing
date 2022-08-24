import type { ActionType, State } from "@/components/Upload";

import { supabase } from "@/server/db/supabase";
import { useCallback, useEffect, useRef } from "react";

import { genID } from "@/utils/genID";
import { trpc } from "@/utils/trpc";

type storageType = { state: State; dispatch: ({}: ActionType) => void };

const useStorage = ({ state, dispatch }: storageType) => {
    const uploadPassword = useRef<string | null>(null);
    const {
        mutateAsync: upload,
        data: File,
        isSuccess,
    } = trpc.proxy.upload.file.useMutation({
        onError: ({ message }) => {
            dispatch({ type: "ERROR", payload: message });
        },
        onSuccess: () => {
            uploadPassword.current = password.current?.value.length ? password.current.value : null;
            dispatch({ type: "UPLOADED" });
        },
    });
    const { isUploading, file, password } = state;

    const uploadFileToStorage = useCallback(
        async (file: File) => {
            const { fileID, path } = genID(file.name);

            await Promise.all([
                supabase.upload(path, file, { contentType: file.type, cacheControl: "3600" }),
                upload({
                    fileID: fileID,
                    path: path,
                    name: file.name,
                    type: file.type,
                    password: password.current?.value,
                }),
            ]);
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
        return { ...File, password: uploadPassword.current };
    }
};

export type returnFile = ReturnType<typeof useStorage>;
export default useStorage;
