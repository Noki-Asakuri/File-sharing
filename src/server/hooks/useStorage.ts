import { Action, ActionType, State } from "@/pages";
import supabase from "@/server/db/supabase";
import genID from "@/utils/genID";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { Dispatch, useEffect, useRef } from "react";

interface UploadFile {
    fileID: string;
    name: string;
    type: string;
    path: string;
    password?: string;
    author: string;
    authorID: string;
}

const useStorage = ({
    state,
    dispatch,
}: {
    state: State;
    dispatch: Dispatch<ActionType>;
}) => {
    const { data: session } = useSession();
    const uploadPassword = useRef<string | null>(null);
    const fileMutation = trpc.useMutation(["file.upload-file"]);

    const { isUploading, file, password } = state;

    useEffect(() => {
        if (isUploading && file) {
            const fileInfo = genID(file.name);
            let mutateData: UploadFile = {
                fileID: fileInfo.fileID,
                path: fileInfo.file,
                name: file.name,
                type: file.type,
                author: session?.user?.name as string,
                authorID: session?.user?.discordID as string,
            };

            if (password.current.length > 0) {
                mutateData = { ...mutateData, password: password.current };
            }

            const uploadFileToStorage = async () => {
                const fileBuffer = await file.arrayBuffer();

                const { error } = await supabase.storage
                    .from("files")
                    .upload(fileInfo.file, fileBuffer, {
                        contentType: file.type,
                    });

                await fileMutation.mutateAsync(mutateData);

                if (password.current.length >= 1) {
                    uploadPassword.current = password.current;
                } else {
                    uploadPassword.current = null;
                }

                dispatch({ type: Action.UPLOADED });
            };

            uploadFileToStorage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading]);

    if (fileMutation.isSuccess) {
        return { ...fileMutation.data, uploadPassword: uploadPassword.current };
    }
};

export default useStorage;
