import { Action, ActionType } from "@/pages/dashboard";
import getBaseUrl from "@/utils/getBaseUrl";
import { trpc } from "@/utils/trpc";
import { File } from "@prisma/client";
import React, { Dispatch, useRef, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import SpinningCircle from "./SpinningCircle";

const DashboardFile: React.FC<{
    file: File;
    dispatch: Dispatch<ActionType>;
}> = ({ file, dispatch }) => {
    const [deleting, setDeleting] = useState<boolean>(false);

    const fileUrl = useRef<string>(getBaseUrl() + "/file/" + file.fileID);
    const deleteFile = trpc.useMutation("file.delete-file-by-id");

    return (
        <div className="max-w-full flex justify-between items-center bg-slate-800 mx-3 py-2 px-5 rounded-lg">
            <ul className="grid grid-cols-[minmax(244px,2fr)_1fr] gap-x-10 w-[80%]">
                <li className="col-span-2">
                    <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                        Name: {file.name}
                    </div>
                </li>
                <li>
                    <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                        Author: {file.author}
                    </div>
                </li>
                <li>
                    <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                        Download: {file.downloadCount}
                    </div>
                </li>
                <li>
                    <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                        Url:{" "}
                        <a
                            href={fileUrl.current}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {fileUrl.current}
                        </a>
                    </span>
                </li>
                <li>
                    <div className="flex items-center gap-2">
                        <span>Locked:</span>
                        <div>
                            {file.password ? (
                                <FaCheckCircle className="text-green-500" />
                            ) : (
                                <FaTimesCircle className="text-red-500" />
                            )}
                        </div>
                    </div>
                </li>
            </ul>
            <button
                className="hover:text-red-500 transition-colors duration-500 bg-slate-700 p-3 rounded-full"
                onClick={() => {
                    const del = async () => {
                        setDeleting(true);
                        await deleteFile.mutateAsync({ fileID: file.fileID });
                        dispatch({ type: Action.DELETE, payload: file.fileID });
                        setDeleting(false);
                    };
                    del();
                }}
            >
                {deleting ? (
                    <SpinningCircle />
                ) : (
                    <FaTrash className="w-6 h-6" />
                )}
            </button>

            {deleteFile.data && deleteFile.data.error && (
                <div className="text-red-500">
                    <span>{deleteFile.data.error}</span>
                </div>
            )}
        </div>
    );
};

export default DashboardFile;
