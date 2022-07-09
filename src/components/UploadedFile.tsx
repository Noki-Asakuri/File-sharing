import React, { useState } from "react";
import CopytoClipboardToast from "./Toast";

import { FaClipboard, FaClipboardCheck } from "react-icons/fa";

interface ReturnFile {
    fileID: string;
    name: string;
    type: string;
    url: string;
    password: string;
}

const UploadedFile: React.FC<{
    file: File | null;
    uploadFile: ReturnFile | undefined;
}> = ({ file, uploadFile }) => {
    const [popup, setPopup] = useState<boolean>(false);

    const copyToClipboard = (text: string | undefined) => {
        if (uploadFile && text) {
            setPopup(true);
            navigator.clipboard.writeText(text);

            setTimeout(() => {
                setPopup(false);
            }, 2000);
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
                <li>
                    <span className="text-sm">
                        Password:{" "}
                        {uploadFile?.password === "None"
                            ? "None"
                            : "*".repeat(6)}
                    </span>
                </li>
                <li className="relative">
                    <CopytoClipboardToast Popup={popup} setPopup={setPopup}>
                        <span className="inline-block text-sm text-ellipsis whitespace-nowrap overflow-hidden max-w-[350px] cursor-default">
                            Url: {uploadFile?.url || "None"}
                        </span>

                        {uploadFile && uploadFile.url && (
                            <button
                                className="-right-11 -top-2 p-3 bg-slate-700 rounded-xl absolute"
                                onClick={() => copyToClipboard(uploadFile?.url)}
                            >
                                {!popup ? (
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
