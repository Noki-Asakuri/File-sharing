import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/future/image";

const UploadForm: React.FC<{
    file: File | null;
    error: string | null;
    isUploading: boolean;
    changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    passwordHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    submitHandler: (e: React.FormEvent) => void;
}> = ({
    file,
    error,
    isUploading,
    changeHandler,
    passwordHandler,
    submitHandler,
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(true);

    const showPasswordHandler = (e: React.FormEvent) => {
        e.preventDefault();

        setShowPassword((current) => !current);
    };

    return (
        <form className="flex flex-col gap-y-7 items-start relative max-w-max p-10 rounded-2xl bg-slate-800 h-[300px]">
            <span className="w-full flex justify-center text-2xl">
                Upload File
            </span>
            <label htmlFor="file">
                File:{" "}
                <span className="bg-slate-700 py-2 px-4 rounded-2xl">
                    {file?.name || "None"}
                </span>
            </label>
            <input
                className="hidden"
                type="file"
                id="file"
                name="file"
                onChange={changeHandler}
                required
            />
            <div className="max-w-max flex justify-center items-center gap-x-4">
                <label htmlFor="password">Password: </label>

                <input
                    className="bg-slate-700 rounded-2xl px-4 py-2 focus:outline-none"
                    type={showPassword ? "password" : "text"}
                    name="password"
                    id="password"
                    onChange={passwordHandler}
                />
                <button
                    className="bg-slate-700 p-3 rounded-xl"
                    aria-label="toggle password display"
                    onClick={showPasswordHandler}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            <button
                className="bg-slate-700 py-2 w-full rounded-2xl h-[40px]"
                onClick={submitHandler}
            >
                {!isUploading ? (
                    "Submit"
                ) : (
                    <Image
                        className="flex justify-center items-center h-7 w-full"
                        src="/uploading.svg"
                        alt="Uploading images"
                    />
                )}
            </button>
            {error && (
                <div className="absolute left-[200px] top-[95px]">
                    <span className="text-sm text-red-600">{error}</span>
                </div>
            )}
        </form>
    );
};

export default UploadForm;
