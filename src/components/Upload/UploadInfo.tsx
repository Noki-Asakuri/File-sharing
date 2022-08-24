import type { returnFile } from "@/server/hooks/useStorage";

import copy from "copy-to-clipboard";
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

const UploadedFile: React.FC<{
    uploadFile: returnFile;
}> = ({ uploadFile }) => {
    const [popupUrl, setPopupUrl] = useState<boolean>(false);
    const [popupPass, setPopupPass] = useState<boolean>(false);

    const createToast = useCallback(
        (type: "url" | "pass") => {
            if (!uploadFile) return;

            const setPopup = type === "url" ? setPopupUrl : setPopupPass;
            copy(type === "url" ? uploadFile.fullUrl : (uploadFile.password as string));

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
        <div className="flex h-[300px] w-[455px] flex-col items-start gap-y-7 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 p-10 drop-shadow-lg">
            <span className="flex w-full items-center justify-center gap-2 text-2xl ">
                <FaInfoCircle /> File Info
            </span>
            {!uploadFile && (
                <div className="flex h-3/5 w-full items-center justify-center">
                    <span>Upload a file to access the file info!</span>
                </div>
            )}

            {uploadFile && (
                <div className="flex w-full flex-col gap-y-3">
                    <div>
                        <span className="flex items-center justify-start gap-2">
                            <FaIdCard />
                            ID: {uploadFile.fileID}
                        </span>
                    </div>
                    <div>
                        <span className="flex items-center justify-start gap-2">
                            <FaUserAlt />
                            Name: {uploadFile.name}
                        </span>
                    </div>
                    {uploadFile.password && (
                        <div className="relative">
                            <span className="flex items-center justify-start gap-2">
                                <FaLock /> Password: {"*".repeat(uploadFile.password.length)}
                            </span>

                            <button
                                className="absolute right-0 -top-2 rounded-xl p-3 transition-all duration-500 hover:bg-slate-700"
                                onClick={() => createToast("pass")}
                            >
                                {!popupPass ? <FaClipboard /> : <FaClipboardCheck />}
                            </button>
                        </div>
                    )}
                    <div className="relative">
                        <span className="flex max-w-[350px] items-center justify-start gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                            <FaCloudDownloadAlt /> Url:
                            <a href={`/file/${uploadFile.fileID}`} target="_blank" rel="noreferrer">
                                {`/file/${uploadFile.fileID}`}
                            </a>
                        </span>

                        <button
                            className="absolute right-0 -top-2 rounded-xl p-3 transition-all duration-500 hover:bg-slate-700"
                            onClick={() => createToast("url")}
                        >
                            {!popupUrl ? <FaClipboard /> : <FaClipboardCheck />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadedFile;
