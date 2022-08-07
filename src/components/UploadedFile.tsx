import React, { useCallback, useState } from "react";

import toast from "react-hot-toast";
import {
    FaClipboard,
    FaClipboardCheck,
    FaCloudDownloadAlt,
    FaIdCard,
    FaInfoCircle,
    FaLock,
    FaUserAlt,
} from "react-icons/fa";

import type { returnFile } from "@/server/hooks/useStorage";

const UploadedFile: React.FC<{
    uploadFile: returnFile;
}> = ({ uploadFile }) => {
    const [popupUrl, setPopupUrl] = useState<boolean>(false);
    const [popupPass, setPopupPass] = useState<boolean>(false);

    const createToast = useCallback(
        (type: "url" | "pass") => {
            if (!uploadFile) return;

            const setPopup = type === "url" ? setPopupUrl : setPopupPass;
            navigator.clipboard.writeText(
                type === "url" ? uploadFile.fullUrl : (uploadFile.password as string),
            );

            setPopup(true);
            setTimeout(() => setPopup(false), 2000);

            toast.success(`Copied to clipboard!`, {
                position: "bottom-right",
                duration: 2000,
                style: {
                    borderRadius: "10px",
                    background: "#262626",
                    color: "#E8DCFF",
                },
                iconTheme: {
                    primary: "#E8DCFF",
                    secondary: "#262626",
                },
            });
        },
        [uploadFile],
    );

    return (
        <div className="flex flex-col gap-y-7 items-start p-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 w-[455px] h-[300px] drop-shadow-lg">
            <span className="flex items-center justify-center w-full gap-2 text-2xl ">
                <FaInfoCircle />
                File Info
            </span>
            {!uploadFile && (
                <>
                    <div className="flex items-center justify-center w-full h-[60%]">
                        <span>Upload a file to access the file info!</span>
                    </div>
                </>
            )}

            {uploadFile && (
                <>
                    <ul className="flex flex-col w-full gap-y-3">
                        <li>
                            <span className="flex items-center justify-start gap-2">
                                <FaIdCard />
                                ID: {uploadFile.fileID}
                            </span>
                        </li>
                        <li>
                            <span className="flex items-center justify-start gap-2">
                                <FaUserAlt />
                                Name: {uploadFile.name}
                            </span>
                        </li>
                        {uploadFile.password && (
                            <li className="relative">
                                <span className="flex items-center justify-start gap-2">
                                    <FaLock /> Password: {"*".repeat(uploadFile.password.length)}
                                </span>

                                <button
                                    className="absolute right-0 p-3 transition-all duration-500 -top-2 rounded-xl hover:bg-slate-700"
                                    onClick={() => createToast("pass")}
                                >
                                    {!popupPass ? <FaClipboard /> : <FaClipboardCheck />}
                                </button>
                            </li>
                        )}
                        <li className="relative">
                            <span className="text-ellipsis whitespace-nowrap overflow-hidden max-w-[350px] gap-2 flex justify-start items-center">
                                <FaCloudDownloadAlt /> Url:
                                <a href={uploadFile.url} target="_blank" rel="noreferrer">
                                    {uploadFile.url || "None"}
                                </a>
                            </span>

                            <button
                                className="absolute right-0 p-3 transition-all duration-500 -top-2 rounded-xl hover:bg-slate-700"
                                onClick={() => createToast("url")}
                            >
                                {!popupUrl ? <FaClipboard /> : <FaClipboardCheck />}
                            </button>
                        </li>
                    </ul>
                </>
            )}
        </div>
    );
};

export default UploadedFile;
