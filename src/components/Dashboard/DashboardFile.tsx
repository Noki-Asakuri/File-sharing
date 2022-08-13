import { ActionType } from "@/pages/dashboard";
import { trpc } from "@/utils/trpc";
import { File } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { Dispatch, useState } from "react";
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
    FaEdit,
} from "react-icons/fa";
import SpinningCircle from "../SpinningCircle";
import ResetModal from "./ResetModal";

dayjs.extend(relativeTime);

const DashboardFile: React.FC<{
    file: File;
    dispatch: Dispatch<ActionType>;
}> = ({ file, dispatch }) => {
    const [deleting, setDeleting] = useState<boolean>(false);

    const { mutate: deleteFile } = trpc.useMutation("file.delete-file-by-id", {
        onError: ({ message }) => {
            toast.error(message, {
                style: {
                    borderRadius: "10px",
                    background: "#262626",
                    color: "#E8DCFF",
                },
                iconTheme: { primary: "#e06c75", secondary: "#262626" },
                duration: 2000,
            });
        },
        onSettled: () => {
            setDeleting(false);
        },
    });

    return (
        <div className="relative flex items-center justify-between max-w-full px-5 py-2 mx-3 border rounded-lg bg-slate-800 border-slate-700 dashboard:h-64">
            <ul className="grid grid-cols-[minxmax(200px,1fr)_1fr_1fr] gap-x-10 w-4/5 text-base">
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
                        <a href={`file/${file.fileID}`} target="_blank" rel="noreferrer">
                            {`file/${file.fileID}`}
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

            <ResetModal file={{ authorID: file.authorID, fileID: file.fileID }}>
                <button className="absolute p-3 duration-500 rounded-full hover:text-blue-500 bg-slate-700 top-2 right-14">
                    <FaEdit className="w-4 h-4" />
                </button>
            </ResetModal>

            <button
                className="absolute p-3 duration-500 rounded-full hover:text-red-500 bg-slate-700 top-2 right-2"
                onClick={() => {
                    deleteFile({ fileID: file.fileID });
                    dispatch({ type: "DELETE", payload: file.fileID });
                }}
            >
                {deleting ? (
                    <SpinningCircle className="w-4 h-4" />
                ) : (
                    <FaTrash className="w-4 h-4" />
                )}
            </button>
        </div>
    );
};

export default DashboardFile;
