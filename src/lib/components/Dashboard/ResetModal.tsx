import {
    Close,
    Content,
    Description,
    Overlay,
    Root,
    Title,
    Trigger,
    Portal,
} from "@radix-ui/react-dialog";
import React, { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaLock, FaTimesCircle } from "react-icons/fa";

import SpinningCircle from "$lib/components/Svg/SpinningCircle";
import { trpc } from "$lib/utils/trpc";

type InputFormProps = {
    show: boolean;
    setShow: (v: (v: boolean) => boolean) => void;
    name: string;
};

// eslint-disable-next-line react/display-name
const InputForm = React.forwardRef<HTMLInputElement, InputFormProps>(
    ({ name, show, setShow }, ref) => {
        return (
            <div className="flex items-center justify-center rounded-2xl bg-slate-700 ">
                <input
                    className="ml-4 bg-inherit py-2 focus:outline-none"
                    type={show ? "password" : "text"}
                    name={name}
                    id={name}
                    ref={ref}
                />
                <button
                    className="px-3"
                    aria-label="toggle password display"
                    type="button"
                    onClick={() => setShow((current) => !current)}
                >
                    {show ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        );
    },
);

type ResetModalProps = {
    children: React.ReactNode;
    file: { fileID: string; authorID: string };
};

const ResetModal: React.FC<ResetModalProps> = ({ file, children }) => {
    const [showNewPass, setshowNewPass] = useState<boolean>(true);
    const [showConfirm, setShowConfirm] = useState<boolean>(true);
    const [isOpen, setOpen] = useState(false);

    const newPassRef = useRef<HTMLInputElement>(null);
    const confirmPassRef = useRef<HTMLInputElement>(null);

    const { mutate: updatePass, isLoading } = trpc.proxy.file.update_pass.useMutation({
        onError: ({ message }) => {
            toast.error(message, {
                style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
                duration: 2000,
            });
        },
        onSuccess: () => {
            toast.success("Updated password", {
                style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
                duration: 2000,
            });
            setOpen(false);
        },
        trpc: { ssr: false },
    });

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();

        const newPass = newPassRef.current?.value;
        const confirm = confirmPassRef.current?.value;

        if (newPass !== confirm) {
            return toast.error("Password and Comfirm not same", {
                style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
                duration: 2000,
            });
        }

        updatePass({
            authorID: file.authorID,
            fileID: file.fileID,
            newPassword: newPassRef.current?.value as string,
        });
    };

    return (
        <Root open={isOpen} onOpenChange={setOpen}>
            <Trigger asChild>{children}</Trigger>
            <Portal>
                <Overlay className="fixed inset-0 z-30 bg-black/50" />

                <Content className="fixed top-1/2 left-1/2 z-50 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-600  p-7">
                    <Title className="w-full text-center text-xl">Update Password</Title>
                    <Description className="mt-3 mb-5 text-center text-sm">
                        Reset and update to new password.
                    </Description>
                    <form className="relative flex flex-col gap-y-4" onSubmit={submitHandler}>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="newPassword"
                                className="flex items-center justify-center gap-2"
                            >
                                <FaLock /> Password:
                            </label>
                            <InputForm
                                name="newPassword"
                                ref={newPassRef}
                                setShow={setshowNewPass}
                                show={showNewPass}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="confirm"
                                className="flex items-center justify-center gap-2"
                            >
                                <FaLock /> Confirm:
                            </label>
                            <InputForm
                                name="confirm"
                                ref={confirmPassRef}
                                setShow={setShowConfirm}
                                show={showConfirm}
                            />
                        </div>
                        <div className="flex justify-between">
                            <div className="w-2/3 text-xs">
                                <span className="text-red-500">(*) </span>
                                <span className="text-gray-300">
                                    Leave blank if you want to disable password lock.
                                </span>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative flex w-20 items-center justify-center rounded-lg bg-green-200 px-3 py-2 text-green-700"
                            >
                                {!isLoading ? (
                                    "Update"
                                ) : (
                                    <SpinningCircle className="h-6 w-6 text-green-700" />
                                )}
                            </button>
                        </div>
                    </form>

                    <Close asChild>
                        <button className="group absolute top-3 right-3 inline-flex items-center justify-center rounded-full">
                            <FaTimesCircle className="h-6 w-6 transition-colors group-hover:text-red-500 " />
                        </button>
                    </Close>
                </Content>
            </Portal>
        </Root>
    );
};

export default ResetModal;
