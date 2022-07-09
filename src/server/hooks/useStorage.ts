import supabase from "@/server/db/supabase";
import React, { useEffect } from "react";
import { trpc } from "@/utils/trpc";
import genID from "@/utils/genID";

interface UploadFile {
    fileID: string;
    name: string;
    type: string;
    path: string;
    password?: string;
}

interface ReturnFile {
    fileID: string;
    name: string;
    type: string;
    url: string;
    password: string;
}

const useStorage = ({
    file,
    isUploading,
    password,
    setUploadFile,
}: {
    file: File | null;
    isUploading: boolean;
    password: string;
    setUploadFile: React.Dispatch<React.SetStateAction<ReturnFile | undefined>>;
}) => {
    const fileMutation = trpc.useMutation(["file.upload-file"]);

    useEffect(() => {
        if (!isUploading) {
            return;
        }

        if (!file) {
            return;
        }

        const fileInfo = genID(file.name);
        let mutateData: UploadFile = {
            fileID: fileInfo.fileID,
            path: fileInfo.file,
            name: file.name,
            type: file.type,
        };

        if (password.length > 0) {
            mutateData = { ...mutateData, password };
        }

        console.log(fileInfo);
        file.arrayBuffer().then((data) => {
            supabase.storage
                .from("files")
                .upload(fileInfo.file, data, { contentType: file.type });
        });

        fileMutation.mutate(mutateData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploading]);

    useEffect(() => {
        if (fileMutation.data) {
            setUploadFile(fileMutation.data);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileMutation.data]);
};

export default useStorage;
