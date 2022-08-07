import { ActionType } from "@/pages/dashboard";
import getBaseUrl from "@/utils/getBaseUrl";
import { trpc } from "@/utils/trpc";
import { File } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { Dispatch, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    FaArrowAltCircleDown,
    FaCheckCircle,
    FaCloudDownloadAlt,
    FaIdCard,
    FaLock,
    FaTimesCircle,
    FaTrash,
    FaUpload,
    FaUserAlt,
} from "react-icons/fa";
import SpinningCircle from "./SpinningCircle";

dayjs.extend(relativeTime);

const DashboardFile: React.FC<{
    file: File;
    dispatch: Dispatch<ActionType>;
}> = ({ file, dispatch }) => {
    const [deleting, setDeleting] = useState<boolean>(false);

    const fileUrl = useRef<string>(getBaseUrl() + "/file/" + file.fileID);
    const { mutateAsync: deleteFile, error } = trpc.useMutation("file.delete-file-by-id");

    return (
        <div className="relative flex items-center justify-between max-w-full px-5 py-2 mx-3 border rounded-lg bg-slate-800 border-slate-700 dashboard:h-64">
            <ul className="grid grid-cols-[minxmax(200px,1fr)_1fr_1fr] gap-x-10 w-4/5 text-lg dashboard:text-base">
                <li className="col-span-4">
                    <div className="flex items-center justify-start gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <FaIdCard />
                        Name: {file.name}
                    </div>
                </li>
                <li className="col-span-2">
                    <div className="flex items-center justify-start gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <FaUserAlt />
                        Author: {file.author}
                    </div>
                </li>
                <li className="col-span-2">
                    <div className="relative group max-w-max">
                        <span className="flex items-center justify-start gap-2">
                            <FaUpload />
                            Uploaded {dayjs(file.createdAt).fromNow()}
                        </span>
                        <span className="absolute -top-10 left-10 scale-0 text-sm group-hover:scale-100 w-max bg-[#18191c] py-2 px-3 rounded-md transition-all">
                            <div className="absolute w-2 h-2 -rotate-90 left-2/4 -bottom-2 bg-inherit arrow" />
                            {dayjs(file.createdAt).format("MM-DD-YYYY, hh:mm:ss A")}
                        </span>
                    </div>
                </li>
                <li className="col-span-2">
                    <span className="flex items-center justify-start gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <FaCloudDownloadAlt /> Url:{" "}
                        <a href={fileUrl.current} target="_blank" rel="noreferrer">
                            {fileUrl.current}
                        </a>
                    </span>
                </li>
                <li>
                    <div className="flex items-center justify-start gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <FaArrowAltCircleDown />
                        Download: {file.downloadCount}
                    </div>
                </li>

                <li>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-start gap-2">
                            <FaLock /> Locked:
                        </span>
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
                className="p-3 duration-500 rounded-full hover:text-red-500 bg-slate-700 dashboard:absolute dashboard:top-2 dashboard:right-2"
                onClick={() => {
                    const deleteFunc = async () => {
                        await deleteFile({ fileID: file.fileID });
                        dispatch({ type: "DELETE", payload: file.fileID });
                    };

                    if (window.innerWidth > 1400) {
                        setDeleting(true);
                        deleteFunc().then(() => setDeleting(false));
                    } else {
                        toast.promise(
                            deleteFunc(),
                            {
                                loading: <b>Deleting...</b>,
                                success: <b>Deleted file.</b>,
                                error: <b>Could not delete file.</b>,
                            },
                            {
                                style: {
                                    borderRadius: "10px",
                                    background: "#262626",
                                    color: "#E8DCFF",
                                },
                                iconTheme: {
                                    primary: "#E8DCFF",
                                    secondary: "#262626",
                                },
                            },
                        );
                    }
                }}
            >
                {deleting ? (
                    <SpinningCircle />
                ) : (
                    <FaTrash className="w-6 h-6 dashboard:w-4 dashboard:h-4" />
                )}
            </button>

            {error && (
                <div className="text-red-500">
                    <span>{error.message}</span>
                </div>
            )}
        </div>
    );
};

export default DashboardFile;
