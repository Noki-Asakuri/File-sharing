import { ActionType, State } from "@/pages";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFile, FaLock, FaUpload } from "react-icons/fa";
import SpinningCircle from "./SpinningCircle";

const UploadForm: React.FC<{
    state: State;
    dispatch: React.Dispatch<ActionType>;
}> = ({ state, dispatch }) => {
    const [showPassword, setShowPassword] = useState<boolean>(true);

    return (
        <form
            className="flex flex-col gap-y-6 items-start relative max-w-max p-10 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 h-[300px] drop-shadow-lg"
            onSubmit={(e) => {
                e.preventDefault();
                dispatch({ type: "SUBMIT" });
            }}
        >
            <span className="flex items-center justify-center w-full gap-2 text-2xl">
                <FaUpload />
                Upload File
            </span>
            <label
                htmlFor="file"
                className="flex items-center justify-center gap-2"
            >
                <FaFile />
                File:
                <span className="px-4 py-2 bg-slate-700 rounded-2xl">
                    {state.file?.name || "None"}
                </span>
            </label>
            <input
                className="hidden"
                type="file"
                id="file"
                name="file"
                onChange={(e) =>
                    dispatch({ type: "CHANGE", payload: e.target.files![0] })
                }
            />
            <div className="flex items-center justify-center max-w-max gap-x-4">
                <label
                    htmlFor="password"
                    className="flex items-center justify-center gap-2"
                >
                    <FaLock /> Password:
                </label>

                <div className="flex items-center justify-center bg-slate-700 rounded-2xl">
                    <input
                        className="py-2 ml-4 bg-inherit focus:outline-none"
                        type={showPassword ? "password" : "text"}
                        name="password"
                        id="password"
                        ref={state.password}
                    />
                    <button
                        className="px-4"
                        aria-label="toggle password display"
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            <button
                className="bg-slate-700 py-2 w-full rounded-2xl h-[40px] drop-shadow-lg"
                type="submit"
            >
                {!state.isUploading ? (
                    "Submit"
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <SpinningCircle />
                    </div>
                )}
            </button>

            {state.error && (
                <div className="absolute right-10 top-[108px]">
                    <span className="text-sm text-red-600">{state.error}</span>
                </div>
            )}
        </form>
    );
};

export default UploadForm;
