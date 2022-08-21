import { trpc } from "@/utils/trpc";
import * as Modal from "@radix-ui/react-dialog";
import React, { FormEvent, useRef, useState } from "react";

import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaLock, FaTimesCircle } from "react-icons/fa";
import SpinningCircle from "../Svg/SpinningCircle";

const ResetModal: React.FC<{
    children: React.ReactNode;
    file: { fileID: string; authorID: string };
}> = ({ children, file }) => {
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const [showConfirm, setShowConfirm] = useState<boolean>(true);

    const newPassRef = useRef<HTMLInputElement>(null);
    const confirmPassRef = useRef<HTMLInputElement>(null);

    const { mutate: updatePass, isLoading } = trpc.useMutation("file.update-pass", {
        onError: ({ message }) => {
            toast.error(message, {
                style: {
                    borderRadius: "10px",
                    background: "#262626",
                    color: "#E8DCFF",
                },
                iconTheme: { primary: "#e06c75", secondary: "#262626" },
                duration: 2000,
            });
        },
        onSuccess: () => {
            toast.success("Updated password", {
                style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
                iconTheme: { primary: "#15803d", secondary: "#262626" },
                duration: 2000,
            });
        },
    });

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();

        const newPass = newPassRef.current?.value;
        const confirm = confirmPassRef.current?.value;

        if (!newPass || !confirm) {
            return toast.error("Password and Confirm can't not be empty", {
                style: {
                    borderRadius: "10px",
                    background: "#262626",
                    color: "#E8DCFF",
                },
                iconTheme: { primary: "#e06c75", secondary: "#262626" },
                duration: 2000,
            });
        }

        if (newPass !== confirm) {
            return toast.error("Password and Comfirm not same", {
                style: {
                    borderRadius: "10px",
                    background: "#262626",
                    color: "#E8DCFF",
                },
                iconTheme: { primary: "#e06c75", secondary: "#262626" },
                duration: 2000,
            });
        }

        updatePass({
            authorID: file.authorID,
            fileID: file.fileID,
            newPassword: newPassRef.current?.value!,
        });
    };

    return (
        <Modal.Root>
            <Modal.Trigger asChild>{children}</Modal.Trigger>
            <Modal.Portal>
                <Modal.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Modal.Content className="fixed top-1/2 left-1/2 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-600 p-7">
                    <Modal.Title className="w-full text-center text-xl">
                        Update Password
                    </Modal.Title>
                    <Modal.Description className="mt-3 mb-5 text-center text-sm">
                        Reset and update to new password.
                    </Modal.Description>
                    <form className="relative flex flex-col gap-y-4" onSubmit={submitHandler}>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="newPassword"
                                className="flex items-center justify-center gap-2"
                            >
                                <FaLock /> Password:
                            </label>
                            <div className="flex items-center justify-center rounded-2xl bg-slate-700">
                                <input
                                    className="ml-4 bg-inherit py-2 focus:outline-none"
                                    type={showPassword ? "password" : "text"}
                                    name="newPassword"
                                    id="newPassword"
                                    ref={newPassRef}
                                />
                                <button
                                    className="px-3"
                                    aria-label="toggle password display"
                                    type="button"
                                    onClick={() => setShowPassword((current) => !current)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="confirmPassword"
                                className="flex items-center justify-center gap-2"
                            >
                                <FaLock /> Confirm:
                            </label>
                            <div className="flex items-center justify-center rounded-2xl bg-slate-700">
                                <input
                                    className="ml-4 bg-inherit py-2 focus:outline-none"
                                    type={showConfirm ? "password" : "text"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    ref={confirmPassRef}
                                />
                                <button
                                    className="px-3"
                                    aria-label="toggle password display"
                                    type="button"
                                    onClick={() => setShowConfirm((current) => !current)}
                                >
                                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="relative flex w-20 justify-center rounded-lg bg-green-200 px-3 py-2 text-green-700"
                            >
                                {!isLoading ? (
                                    "Update"
                                ) : (
                                    <SpinningCircle className="h-6 w-6 text-green-700" />
                                )}
                            </button>
                        </div>
                    </form>

                    <Modal.Close asChild>
                        <button className="group absolute top-3 right-3 inline-flex items-center justify-center rounded-full bg-slate-900">
                            <FaTimesCircle className="h-6 w-6 rounded-full transition-colors group-hover:text-red-500 " />
                        </button>
                    </Modal.Close>
                </Modal.Content>
            </Modal.Portal>
        </Modal.Root>
    );
};

export default ResetModal;
