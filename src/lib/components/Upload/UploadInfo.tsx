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
import { UploadFile } from ".";

const UploadedFile: React.FC<{ upload?: UploadFile }> = ({ upload }) => {
    const [popupUrl, setPopupUrl] = useState<boolean>(false);
    const [popupPass, setPopupPass] = useState<boolean>(false);

    const createToast = useCallback(
        (type: "url" | "pass") => {
            if (!upload) return;

            const setPopup = type === "url" ? setPopupUrl : setPopupPass;
            copy(type === "url" ? upload.fullUrl : (upload.password as string));

            setPopup(true);
            setTimeout(() => setPopup(false), 2000);

            toast.success("Copied to clipboard!");
        },
        [upload],
    );

    return (
        <div className="flex h-80 w-[31rem] flex-col items-start gap-y-7 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 p-10 drop-shadow-lg">
            <span className="flex w-full items-center justify-center gap-2 text-2xl ">
                <FaInfoCircle /> File Info
            </span>
            {!upload && (
                <div className="flex h-3/5 w-full items-center justify-center">
                    <span>Upload a file to access the file info!</span>
                </div>
            )}

            {upload && (
                <div className="flex w-full flex-col">
                    <div className="flex h-10 items-center justify-start gap-2">
                        <FaIdCard />
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                            ID: {upload.fileID}
                        </span>
                    </div>
                    <div className="flex h-10 items-center justify-start gap-2">
                        <FaUserAlt />
                        Name: {upload.name}
                    </div>
                    <div className="relative">
                        <span className="flex h-10 items-center justify-start gap-2">
                            <FaLock /> Password:{" "}
                            {upload.password ? "*".repeat(upload.password.length) : "None"}
                        </span>
                        {upload.password && (
                            <button
                                className="absolute right-0 -top-2 rounded-xl p-3 transition-all duration-500 hover:bg-slate-700"
                                onClick={() => createToast("pass")}
                            >
                                {!popupPass ? <FaClipboard /> : <FaClipboardCheck />}
                            </button>
                        )}
                    </div>
                    <div className="relative flex h-10 max-w-full items-center justify-start gap-x-2">
                        <div className="flex h-10 items-center justify-start gap-2">
                            <FaCloudDownloadAlt /> Url:
                        </div>
                        <a
                            href={`/file/${upload.fileID}`}
                            target="_blank"
                            rel="noreferrer"
                            className="overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {`/file/${upload.fileID}`}
                        </a>
                        <button
                            className="rounded-xl p-3 transition-all duration-500 hover:bg-slate-700"
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
