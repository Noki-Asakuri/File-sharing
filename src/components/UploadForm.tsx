import { ActionType, State } from "@/pages";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaFile, FaLock } from "react-icons/fa";

const UploadForm: React.FC<{
    state: State;
    dispatch: React.Dispatch<ActionType>;
}> = ({ state, dispatch }) => {
    const [showPassword, setShowPassword] = useState<boolean>(true);

    return (
        <form
            className="flex flex-col gap-y-6 items-start relative max-w-max p-10 rounded-2xl bg-slate-800 h-[300px]"
            onSubmit={(e) => {
                e.preventDefault();
                dispatch({ type: "SUBMIT" });
            }}
        >
            <span className="flex justify-center w-full text-2xl">
                Upload File
            </span>
            <label
                htmlFor="file"
                className="flex items-center justify-center gap-2"
            >
                <FaFile />
                File:{" "}
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
                required
            />
            <div className="flex items-center justify-center max-w-max gap-x-4">
                <label
                    htmlFor="password"
                    className="flex items-center justify-center gap-2"
                >
                    <FaLock /> Password:{" "}
                </label>

                <input
                    className="px-4 py-2 bg-slate-700 rounded-2xl focus:outline-none"
                    type={showPassword ? "password" : "text"}
                    name="password"
                    id="password"
                    onChange={(e) =>
                        dispatch({ type: "PASSWORD", payload: e.target.value })
                    }
                />
                <button
                    className="p-3 bg-slate-700 rounded-xl"
                    aria-label="toggle password display"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowPassword((current) => !current);
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            <input
                className="bg-slate-700 py-2 w-full rounded-2xl h-[40px] cursor-pointer"
                type="submit"
                value={state.isUploading ? "Uploading..." : "Submit"}
            />

            {state.error && (
                <div className="absolute right-10 top-[108px]">
                    <span className="text-sm text-red-600">{state.error}</span>
                </div>
            )}
        </form>
    );
};

export default UploadForm;
