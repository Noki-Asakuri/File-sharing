import { ActionType, State } from "@/pages";
import supabase from "@/server/db/supabase";
import genID from "@/utils/genID";
import { trpc } from "@/utils/trpc";
import { Dispatch, useEffect, useRef } from "react";

const useStorage = ({
    state,
    dispatch,
}: {
    state: State;
    dispatch: Dispatch<ActionType>;
}) => {
    const uploadPassword = useRef<string | null>(null);
    const fileMutation = trpc.useMutation(["upload.file"], {
        onError: ({ message }) => {
            dispatch({ type: "ERROR", payload: message });
        },
    });

    const { isUploading, file, password } = state;

    useEffect(() => {
        if (isUploading && file) {
            const fileInfo = genID(file.name);

            const uploadFileToStorage = async () => {
                const fileBuffer = await file.arrayBuffer();

                await supabase.storage
                    .from("files")
                    .upload(fileInfo.file, fileBuffer, {
                        contentType: file.type,
                    });

                await fileMutation.mutateAsync({
                    fileID: fileInfo.fileID,
                    path: fileInfo.file,
                    name: file.name,
                    type: file.type,
                    password: password.current,
                });

                uploadPassword.current = password.current.length
                    ? password.current
                    : null;

                dispatch({ type: "UPLOADED" });
            };

            uploadFileToStorage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading]);

    if (fileMutation.isSuccess) {
        return { ...fileMutation.data, uploadPassword: uploadPassword.current };
    }
};

export type returnFile = ReturnType<typeof useStorage>;
export default useStorage;
