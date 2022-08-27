import Image from "next/future/image";
import { useState } from "react";

import { ServerProps } from "@/pages/file/[fileID]";

import SpinningCircle from "$lib/components/Svg/SpinningCircle";
import createDownload from "$lib/utils/download";
import { trpc } from "$lib/utils/trpc";

import {
    FaArrowAltCircleDown,
    FaCheckCircle,
    FaIdCard,
    FaSignInAlt,
    FaTimesCircle,
    FaUpload,
    FaUserTie,
} from "react-icons/fa";

type TabState = { tab: "File" | "User"; page?: string };

const InfoCard: React.FC<ServerProps> = ({ author, file, session }) => {
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<TabState>({ tab: "File" });

    const updateTab = (tab: TabState["tab"]) => {
        const page = tab === "File" ? "" : "translate-x-[126px]";

        return setActiveTab({ tab, page });
    };

    const { mutate: download } = trpc.proxy.file.download.useMutation({
        onMutate: () => setIsDownload(true),
        onSuccess: ({ downloadUrl }) => createDownload(file.name, downloadUrl),
        onSettled: () => setIsDownload(false),
    });

    return (
        <div className="h-[400px] w-[500px] rounded-2xl bg-gradient-to-br from-gray-700 to-slate-900">
            <div className="flex w-full items-center justify-between px-7 pt-7">
                <div className="flex flex-col justify-center">
                    <Image
                        className="rounded-full"
                        src={`${author.image}?size=1024`}
                        alt="Discord Avatar"
                        width="130"
                        height="130"
                    />
                    <div className="py-2 text-lg">
                        <span className="font-bold text-white">{author.name}</span>
                        <span className="text-gray-400">{author.discriminator}</span>
                        {session && session.user.discordID === author.discordID && (
                            <span className="text-xs text-gray-500">{" (You)"}</span>
                        )}
                    </div>
                </div>
                <div>
                    <button
                        className="h-11 w-44 rounded-md bg-gradient-to-bl from-green-600 to-green-800 px-4 py-2"
                        onClick={() => download({ fileID: file.fileID, path: file.path })}
                        disabled={isDownload}
                    >
                        {isDownload ? (
                            <span className="flex items-center gap-2">
                                Downloading <SpinningCircle />
                            </span>
                        ) : (
                            <span>Download</span>
                        )}
                    </button>
                </div>
            </div>

            <div>
                <div className="relative flex gap-7 px-7">
                    <button className="w-24 py-2" onClick={() => updateTab("File")}>
                        File Info
                    </button>
                    <button className="w-24 py-2" onClick={() => updateTab("User")}>
                        User Info
                    </button>
                    <div
                        className={`absolute bottom-0 w-24 border-b-2 border-white transition-transform ${activeTab.page}`}
                    />
                </div>

                <div className="w-full border-t-2 border-t-gray-600 opacity-60" />
                <div>
                    {activeTab.tab === "File" && (
                        <div className="flex max-w-max flex-col gap-3 p-7">
                            <span className="flex items-center justify-start gap-2">
                                <FaIdCard />
                                Name: {file.name}
                            </span>
                            <span className="flex items-center justify-start gap-2">
                                <FaArrowAltCircleDown />
                                Downloaded: {file.downloadCount}
                            </span>
                            <div className="group relative max-w-max">
                                <span className="flex items-center justify-start gap-2">
                                    <FaUpload />
                                    Uploaded {file.relativeTime}
                                </span>
                                <span className="absolute -top-2 left-[110%] w-max scale-0 rounded-md bg-[#18191c] py-2 px-3 text-sm transition-all group-hover:scale-100">
                                    <div className="arrow absolute top-[40%] -left-2 h-2 w-2 bg-inherit" />
                                    {file.createdAt}
                                </span>
                            </div>
                        </div>
                    )}
                    {activeTab.tab === "User" && (
                        <div className="flex flex-col gap-3 p-7">
                            <span className="flex items-center justify-start gap-2">
                                <FaIdCard />
                                Name: {author.fullName}
                            </span>
                            <span className="flex items-center justify-start gap-2">
                                <FaUserTie />
                                Admin:{" "}
                                {author.isAdmin ? (
                                    <FaCheckCircle className="text-green-500" />
                                ) : (
                                    <FaTimesCircle className="text-red-500" />
                                )}
                            </span>
                            <div className="group relative w-max">
                                <span className="flex items-center justify-start gap-2">
                                    <FaSignInAlt />
                                    Joined {author.relativeTime}
                                </span>
                                <span className="absolute -top-2 left-[110%] w-max scale-0 rounded-md bg-[#18191c] py-2 px-3 text-sm transition-all group-hover:scale-100">
                                    <div className="arrow absolute top-[40%] -left-2 h-2 w-2 bg-inherit" />
                                    {author.joinDate}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
