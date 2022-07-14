import React, { useState } from "react";
import CopytoClipboardToast from "./Toast";

import { FaClipboard, FaClipboardCheck } from "react-icons/fa";

interface ReturnFile {
    uploadPassword: string | null;
    fileID: string;
    name: string;
    type: string | null;
    url: string;
    password: string;
}

const UploadedFile: React.FC<{
    uploadFile: ReturnFile | undefined;
}> = ({ uploadFile }) => {
    const [popupUrl, setPopupUrl] = useState<boolean>(false);
    const [popupPass, setPopupPass] = useState<boolean>(false);

    const copyToClipboard = (
        text: string | undefined,
        type: "password" | "url"
    ) => {
        if (uploadFile && text) {
            if (type == "url") {
                setPopupUrl(true);
                navigator.clipboard.writeText(text);

                setTimeout(() => {
                    setPopupUrl(false);
                }, 2000);
            } else {
                setPopupPass(true);
                navigator.clipboard.writeText(text);

                setTimeout(() => {
                    setPopupPass(false);
                }, 2000);
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-7 items-start p-10 rounded-2xl bg-slate-800 w-[455px] h-[300px]">
            <span className="w-full flex justify-center text-2xl ">
                File Info
            </span>
            <ul className="flex flex-col gap-y-2">
                <li>
                    <span className="text-sm">
                        ID: {uploadFile?.fileID || "None"}
                    </span>
                </li>
                <li>
                    <span className="text-sm">
                        Name: {uploadFile?.name || "None"}
                    </span>
                </li>
                <li className="relative">
                    <CopytoClipboardToast
                        popup={popupPass}
                        setPopup={setPopupPass}
                        name="password"
                    >
                        <span className="text-sm">
                            Password:{" "}
                            {!uploadFile?.uploadPassword
                                ? "None"
                                : "*".repeat(
                                      uploadFile?.uploadPassword
                                          .length as number
                                  )}
                        </span>
                        {uploadFile && uploadFile.uploadPassword && (
                            <button
                                className="-right-11 -top-2 p-3 rounded-xl absolute hover:bg-slate-700 transition-all duration-500"
                                onClick={() =>
                                    copyToClipboard(
                                        uploadFile?.uploadPassword as string,
                                        "password"
                                    )
                                }
                            >
                                {!popupPass ? (
                                    <FaClipboard />
                                ) : (
                                    <FaClipboardCheck />
                                )}
                            </button>
                        )}
                    </CopytoClipboardToast>
                </li>
                <li className="relative">
                    <CopytoClipboardToast
                        popup={popupUrl}
                        setPopup={setPopupUrl}
                        name="url"
                    >
                        <span className="inline-block text-sm text-ellipsis whitespace-nowrap overflow-hidden max-w-[350px]">
                            Url:{" "}
                            <a
                                href={uploadFile?.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {uploadFile?.url || "None"}
                            </a>
                        </span>

                        {uploadFile && uploadFile.url && (
                            <button
                                className="-right-11 -top-2 p-3 rounded-xl absolute hover:bg-slate-700 transition-all duration-500"
                                onClick={() =>
                                    copyToClipboard(uploadFile?.url, "url")
                                }
                            >
                                {!popupUrl ? (
                                    <FaClipboard />
                                ) : (
                                    <FaClipboardCheck />
                                )}
                            </button>
                        )}
                    </CopytoClipboardToast>
                </li>
            </ul>
        </div>
    );
};

export default UploadedFile;
