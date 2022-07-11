import { Action, ActionType, State } from "@/pages";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UploadForm: React.FC<{
    state: State;
    dispatch: React.Dispatch<ActionType>;
}> = ({ state, dispatch }) => {
    const [showPassword, setShowPassword] = useState<boolean>(true);

    return (
        <form className="flex flex-col gap-y-7 items-start relative max-w-max p-10 rounded-2xl bg-slate-800 h-[300px]">
            <span className="w-full flex justify-center text-2xl">
                Upload File
            </span>
            <label htmlFor="file">
                File:{" "}
                <span className="bg-slate-700 py-2 px-4 rounded-2xl">
                    {state.file?.name || "None"}
                </span>
            </label>
            <input
                className="hidden"
                type="file"
                id="file"
                name="file"
                onChange={(e) =>
                    dispatch({
                        type: Action.CHANGE,
                        payload: e.target.files![0],
                    })
                }
                required
            />
            <div className="max-w-max flex justify-center items-center gap-x-4">
                <label htmlFor="password">Password: </label>

                <input
                    className="bg-slate-700 rounded-2xl px-4 py-2 focus:outline-none"
                    type={showPassword ? "password" : "text"}
                    name="password"
                    id="password"
                    onChange={(e) =>
                        dispatch({
                            type: Action.PASSWORD,
                            payload: e.target.value,
                        })
                    }
                />
                <button
                    className="bg-slate-700 p-3 rounded-xl"
                    aria-label="toggle password display"
                    onClick={(e) => {
                        e.preventDefault();

                        setShowPassword((current) => !current);
                    }}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            <button
                className="bg-slate-700 py-2 w-full rounded-2xl h-[40px]"
                onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: Action.SUBMIT, payload: null });
                }}
            >
                {!state.isUploading ? (
                    "Submit"
                ) : (
                    <div className="flex justify-center items-center w-full">
                        <svg
                            className="animate-spin h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </div>
                )}
            </button>
            {state.error && (
                <div className="absolute left-[200px] top-[95px]">
                    <span className="text-sm text-red-600">{state.error}</span>
                </div>
            )}
        </form>
    );
};

export default UploadForm;
