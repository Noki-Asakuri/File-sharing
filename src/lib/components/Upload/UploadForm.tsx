import type { ActionType, State } from ".";

import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFile, FaLock, FaUpload } from "react-icons/fa";
import SpinningCircle from "$lib/components/Svg/SpinningCircle";

const UploadForm: React.FC<{
    state: State;
    dispatch: React.Dispatch<ActionType>;
}> = ({ state, dispatch }) => {
    const [showPassword, setShowPassword] = useState<boolean>(true);

    return (
        <form
            className="relative flex h-[300px] flex-col items-start gap-y-6 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 p-10 drop-shadow-lg"
            onSubmit={(e) => {
                e.preventDefault();
                dispatch({ type: "SUBMIT" });
            }}
        >
            <span className="flex w-full items-center justify-center gap-2 text-2xl">
                <FaUpload />
                Upload File
            </span>
            <label htmlFor="file" className="flex items-center justify-center gap-2">
                <FaFile />
                File:
                <span className="rounded-2xl bg-slate-700 px-4 py-2">
                    {state.file?.name || "None"}
                </span>
            </label>
            <input
                className="hidden"
                type="file"
                id="file"
                name="file"
                onChange={(e) => dispatch({ type: "CHANGE", payload: e.target.files?.[0] })}
            />
            <div className="flex w-full items-center justify-center gap-x-4">
                <label htmlFor="password" className="flex items-center justify-center gap-2">
                    <FaLock /> Password:
                </label>

                <div className="flex w-full items-center justify-between rounded-2xl bg-slate-700">
                    <input
                        className="ml-4 w-full bg-inherit py-2 focus:outline-none"
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
                className="h-10 w-full rounded-2xl bg-slate-700 py-2 drop-shadow-lg"
                type="submit"
                disabled={state.isUploading}
            >
                {!state.isUploading ? (
                    "Submit"
                ) : (
                    <div className="flex w-full items-center justify-center">
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
