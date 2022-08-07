import { ActionType, State } from "@/pages";
import supabase from "@/server/db/supabase";
import genID from "@/utils/genID";
import { trpc } from "@/utils/trpc";
import { Dispatch, useEffect, useRef } from "react";

const useStorage = ({ state, dispatch }: { state: State; dispatch: Dispatch<ActionType> }) => {
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

    useEffect(() => {
        if (isUploading && file) {
            const fileInfo = genID(file.name);

            const uploadFileToStorage = async () => {
                await supabase.storage
                    .from("files")
                    .upload(fileInfo.file, file, { contentType: file.type });

                await uploadFile({
                    fileID: fileInfo.fileID,
                    path: fileInfo.file,
                    name: file.name,
                    type: file.type,
                    password: password.current!.value,
                });

                uploadPassword.current = password.current!.value.length
                    ? password.current!.value
                    : null;

                dispatch({ type: "UPLOADED" });
            };

            uploadFileToStorage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading]);

    if (isSuccess) {
        return { ...uploadedFile, password: uploadPassword.current };
    }
};

export type returnFile = ReturnType<typeof useStorage>;
export default useStorage;
