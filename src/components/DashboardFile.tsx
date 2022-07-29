import { Action, ActionType } from "@/pages/dashboard";
import getBaseUrl from "@/utils/getBaseUrl";
import { trpc } from "@/utils/trpc";
import { File } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { Dispatch, useRef, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import SpinningCircle from "./SpinningCircle";

dayjs.extend(relativeTime);

const DashboardFile: React.FC<{
    file: File;
    dispatch: Dispatch<ActionType>;
}> = ({ file, dispatch }) => {
    const [deleting, setDeleting] = useState<boolean>(false);

    const fileUrl = useRef<string>(getBaseUrl() + "/file/" + file.fileID);
    const deleteFile = trpc.useMutation("file.delete-file-by-id");

    return (
        <div className="flex items-center justify-between max-w-full px-5 py-2 mx-3 rounded-lg bg-slate-800">
            <ul className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-10 w-[80%]">
                <li className="col-span-4">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Name: {file.name}
                    </div>
                </li>
                <li className="col-span-2">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Author: {file.author}
                    </div>
                </li>
                <li className="col-span-2">
                    <div>
                        <span>
                            Uploaded {dayjs(file.createdAt).fromNow()}
                        </span>
                    </div>
                </li>
                <li className="col-span-2">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
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
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        Download: {file.downloadCount}
                    </div>
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
                className="p-3 transition-colors duration-500 rounded-full hover:text-red-500 bg-slate-700"
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

            {deleteFile.error && (
                <div className="text-red-500">
                    <span>{deleteFile.error.message}</span>
                </div>
            )}
        </div>
    );
};

export default DashboardFile;
