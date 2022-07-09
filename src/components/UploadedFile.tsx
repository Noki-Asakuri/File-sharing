import React, { useState } from "react";
import CopytoClipboardToast from "./Toast";

import { FaClipboard, FaClipboardCheck } from "react-icons/fa";

type FileMutationType =
    | {
          id: string;
          name: string;
          url: string;
          password: string;
          type: string;
          error: Error;
      }
    | {
          id: string;
          name: string;
          type: string;
          url: string;
          password: string;
          error: null;
      }
    | undefined;

const UploadedFile: React.FC<{
    file: File | null;
    fileMutation: FileMutationType;
    password: string | null;
}> = ({ file, fileMutation, password }) => {
    const [popup, setPopup] = useState<boolean>(false);

    const copyToClipboard = (text: string | undefined) => {
        if (fileMutation && text) {
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
                        ID: {fileMutation?.id || "None"}
                    </span>
                </li>
                <li>
                    <span className="text-sm">
                        Name: {fileMutation?.name || "None"}
                    </span>
                </li>
                <li>
                    <span className="text-sm">
                        Password: {password || "None"}
                    </span>
                </li>
                <li className="relative">
                    <CopytoClipboardToast Popup={popup} setPopup={setPopup}>
                        <span className="inline-block text-sm text-ellipsis whitespace-nowrap overflow-hidden max-w-[350px] cursor-default">
                            Url: {fileMutation?.url || "None"}
                        </span>

                        {fileMutation && fileMutation.url && (
                            <button
                                className="-right-11 -top-2 p-3 bg-slate-700 rounded-xl absolute"
                                onClick={() =>
                                    copyToClipboard(fileMutation?.url)
                                }
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

                {/* TODO: Move this somewhere else. */}
                {fileMutation?.error && (
                    <li>Error: {fileMutation.error.message} </li>
                )}
            </ul>
        </div>
    );
};

export default UploadedFile;
