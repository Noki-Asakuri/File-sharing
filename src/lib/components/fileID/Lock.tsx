import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

import SpinningCircle from "$lib/components/Svg/SpinningCircle";
import { trpc } from "$lib/utils/trpc";

interface PasswordFormType {
    fileID: string;
    password: string;
    setLock: (value: boolean) => void;
}

const PasswordForm: React.FC<PasswordFormType> = ({ fileID, password, setLock }) => {
    const inputPasswordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { mutate: checkPass, isLoading } = trpc.proxy.check.password.useMutation({
        onSuccess: ({ download }) => {
            if (download) {
                setLock(false);
                toast.success("Access granted!");
            }
        },
        onError: ({ message }) => toast.error(message),
    });

    return (
        <>
            <form
                className="flex flex-col gap-y-7 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 p-10"
                onSubmit={(e) => {
                    e.preventDefault();
                    checkPass({
                        fileID,
                        password,
                        inputPassword: inputPasswordRef.current?.value as string,
                    });
                }}
            >
                <div className="flex w-full items-center justify-center gap-2 text-2xl">
                    <FaLock /> Locked
                </div>
                <div className="flex max-w-max items-center justify-center gap-x-2">
                    <label htmlFor="password">Password:</label>
                    <div className="flex items-center justify-center rounded-2xl bg-slate-700">
                        <input
                            className="ml-4 bg-inherit py-2 placeholder:text-xs focus:outline-none"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Enter password to access!"
                            ref={inputPasswordRef}
                        />
                        <button
                            className="px-4"
                            aria-label="toggle password display"
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                </div>

                <button
                    className="flex justify-center rounded-2xl bg-slate-700 py-2"
                    type="submit"
                    disabled={isLoading}
                >
                    {!isLoading ? "Submit" : <SpinningCircle />}
                </button>
            </form>
        </>
    );
};

export default PasswordForm;
