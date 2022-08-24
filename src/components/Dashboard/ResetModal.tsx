import { Transition } from "@headlessui/react";
import { Close, Content, Description, Overlay, Root, Title, Trigger } from "@radix-ui/react-dialog";
import React, { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaLock, FaTimesCircle } from "react-icons/fa";

import SpinningCircle from "@/components/Svg/SpinningCircle";
import { trpc } from "@/utils/trpc";

type ResetModalProps = {
    children: React.ReactNode;
    file: { fileID: string; authorID: string };
};

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

const ResetModal: React.FC<ResetModalProps> = ({ children, file }) => {
    const [showPassword, setShowPassword] = useState<boolean>(true);
    const [showConfirm, setShowConfirm] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState(false);

    const newPassRef = useRef<HTMLInputElement>(null);
    const confirmPassRef = useRef<HTMLInputElement>(null);

    const { mutate: updatePass, isLoading } = trpc.proxy.file.update_pass.useMutation({
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
            setIsOpen(false);
        },
    });

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();

        const newPass = newPassRef.current?.value;
        const confirm = confirmPassRef.current?.value;

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
            newPassword: newPassRef.current?.value as string,
        });
    };

    return (
        <Root open={isOpen} onOpenChange={setIsOpen}>
            <Trigger asChild>{children}</Trigger>
            {/* <Portal> */}
            <Transition.Root show={isOpen}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Overlay className="fixed inset-0 z-40 bg-black bg-opacity-50" />
                </Transition.Child>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Content className="fixed top-1/2 left-1/2 z-50 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-600 p-7">
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
                                    setShow={setShowPassword}
                                    show={showPassword}
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
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
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

                        <Close asChild>
                            <button className="group absolute top-3 right-3 inline-flex items-center justify-center rounded-full bg-slate-900">
                                <FaTimesCircle className="h-6 w-6 rounded-full transition-colors group-hover:text-red-500 " />
                            </button>
                        </Close>
                    </Content>
                </Transition.Child>
            </Transition.Root>
            {/* </Portal> */}
        </Root>
    );
};

export default ResetModal;
