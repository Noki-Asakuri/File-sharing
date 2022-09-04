import type { File } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { trpc } from "$lib/utils/trpc";
import type { ActionType } from "@/pages/dashboard";

import {
    FaArrowAltCircleDown,
    FaCheckCircle,
    FaCloudDownloadAlt,
    FaEdit,
    FaIdCard,
    FaLock,
    FaTimesCircle,
    FaTrash,
    FaUpload,
    FaUserAlt,
} from "react-icons/fa";
import SpinningCircle from "../Svg/SpinningCircle";
import ResetModal from "./ResetModal";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type DashboardFileProps = { file: File; dispatch: ({ type, payload }: ActionType) => void };
const DashboardFile: React.FC<DashboardFileProps> = ({ file, dispatch }) => {
    const [deleting, setDeleting] = useState<boolean>(false);
    const { data: session } = useSession();

    const { mutate: deleteFile } = trpc.proxy.file.delete_by_id.useMutation({
        onError: ({ message }) => {
            toast.error(message, {
                style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
                duration: 2000,
            });
        },
        onMutate: () => setDeleting(true),
        onSettled: () => setDeleting(false),
        onSuccess: () => dispatch({ type: "DELETE", payload: file.fileID }),
    });

    return (
        <div className="relative mx-3 flex max-w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-5 py-2 ">
            <ul className="grid w-full grid-cols-[minmax(150px,1fr)_1fr_1fr] gap-x-10">
                <li className="col-span-4">
                    <div className="flex items-center justify-start gap-2">
                        <FaIdCard />
                        Name: {file.name}
                    </div>
                </li>
                <li className="col-span-2">
                    <span className="flex items-center justify-start gap-2 whitespace-nowrap">
                        <FaUserAlt />
                        Author: {file.author}
                    </span>
                </li>
                <li className="col-span-2">
                    <div className="group relative max-w-max">
                        <span className="flex items-center justify-start gap-2">
                            <FaUpload />
                            Uploaded {dayjs(file.createdAt).fromNow()}
                        </span>
                        <span className="absolute -top-10 left-10 w-max scale-0 rounded-md bg-[#18191c] py-2 px-3 text-sm transition-all group-hover:scale-100">
                            <div className="arrow absolute left-2/4 -bottom-2 h-2 w-2 -rotate-90 bg-inherit" />
                            {dayjs(file.createdAt).format("MM-DD-YYYY, hh:mm:ss A")}
                        </span>
                    </div>
                </li>
                <li className="col-span-2 overflow-hidden">
                    <div className="flex items-center justify-start gap-2">
                        <FaCloudDownloadAlt /> Url:{" "}
                        <a
                            href={`file/${file.fileID}`}
                            target="_blank"
                            rel="noreferrer"
                            className="overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {`file/${file.fileID}`}
                        </a>
                    </div>
                </li>
                <li>
                    <div className="flex w-max items-center justify-start gap-2">
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
            <ResetModal file={{ ...file }}>
                <button
                    className="absolute top-2 right-14 rounded-full bg-slate-700 p-2 duration-500 enabled:hover:text-blue-500 disabled:cursor-not-allowed md:p-3"
                    disabled={session?.user.discordID !== file.authorID}
                >
                    <FaEdit className="h-3 w-3 md:h-4 md:w-4" />
                </button>
            </ResetModal>

            <button
                className="absolute top-2 right-2 rounded-full bg-slate-700 p-2 duration-500 hover:text-red-500 md:p-3"
                disabled={deleting}
                onClick={() => deleteFile({ ...file })}
            >
                {deleting ? (
                    <SpinningCircle className="h-3 w-3 md:h-4 md:w-4" />
                ) : (
                    <FaTrash className="h-3 w-3 md:h-4 md:w-4" />
                )}
            </button>
        </div>
    );
};

export default DashboardFile;
