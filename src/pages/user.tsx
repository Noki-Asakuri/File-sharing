import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/future/image";

import copy from "copy-to-clipboard";
import { useCallback, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    FaCheckCircle,
    FaClipboard,
    FaClipboardCheck,
    FaIdCard,
    FaKey,
    FaTimesCircle,
    FaUserTie,
} from "react-icons/fa";

import SpinningIcon from "$lib/components/Svg/SpinningCircle";
import { trpc } from "$lib/utils/trpc";

type TabState = { tab: "User" | "Key"; page?: string };

const UserPage: NextPage = () => {
    const { data: session } = useSession({ required: true });

    const [activeTab, setActiveTab] = useState<TabState>({ tab: "User" });
    const [show, setShow] = useState<boolean>(false);
    const [isCopy, setCopy] = useState<boolean>(false);

    const updateTab = (tab: TabState["tab"]) => {
        return setActiveTab({ tab, page: tab === "User" ? "" : "translate-x-[126px]" });
    };

    const { data, refetch } = trpc.user.getKey.useQuery();
    const { mutate: generate, isLoading } = trpc.user.createKey.useMutation({
        onError: ({ message }) => toast.error(message),
        onSuccess: () => refetch(),
    });

    const createToast = useCallback(() => {
        if (!data || !data.apiKey) return;
        setCopy(true);
        copy(data.apiKey);

        setTimeout(() => setCopy(false), 2000);
        toast.success("Copied to clipboard!");
    }, [data]);

    return (
        <article className="flex h-screen w-full items-center justify-center">
            {session && (
                <div className="h-[400px] w-[500px] rounded-2xl bg-gradient-to-br from-gray-700 to-slate-900">
                    <div className="flex w-full items-center justify-between px-7 pt-7">
                        <div className="flex flex-col justify-center">
                            <Image
                                className="rounded-full"
                                src={`${session.user.image}?size=1024`}
                                alt="Discord Avatar"
                                width="130"
                                height="130"
                            />
                            <div className="py-2 text-lg">
                                <span className="font-bold text-white">
                                    {session.user.name.split("#")[0]}
                                </span>
                                <span className="text-gray-400">
                                    #{session.user.name.split("#")[1]}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="relative flex gap-7 px-7">
                            <button className="w-24 py-2" onClick={() => updateTab("User")}>
                                User Info
                            </button>
                            <button className="w-24 py-2" onClick={() => updateTab("Key")}>
                                Api Key
                            </button>
                            <div
                                className={`absolute bottom-0 w-24 border-b-2 border-white transition-transform ${activeTab.page}`}
                            />
                        </div>

                        <div className="w-full border-t-2 border-t-gray-600 opacity-60" />

                        {activeTab.tab === "User" && (
                            <div className="flex flex-col gap-3 p-7">
                                <span className="flex items-center justify-start gap-2">
                                    <FaIdCard />
                                    Name: {session.user.name}
                                </span>
                                <span className="flex items-center justify-start gap-2">
                                    <FaUserTie />
                                    Admin:{" "}
                                    {session.user.isAdmin ? (
                                        <FaCheckCircle className="text-green-500" />
                                    ) : (
                                        <FaTimesCircle className="text-red-500" />
                                    )}
                                </span>
                            </div>
                        )}
                        {activeTab.tab === "Key" && (
                            <div className="flex flex-col gap-3 p-7">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center justify-start gap-2">
                                        <FaKey />
                                        Key:
                                    </span>
                                    <button
                                        className="w-48 rounded-xl bg-green-700 p-3 transition-colors hover:bg-green-600"
                                        onClick={() => generate()}
                                        disabled={isLoading}
                                    >
                                        {!isLoading ? (
                                            "Generate new key"
                                        ) : (
                                            <div className="flex w-full items-center justify-center gap-x-2">
                                                Generating <SpinningIcon />
                                            </div>
                                        )}
                                    </button>
                                </div>
                                <div className="flex h-10 w-full items-center justify-between rounded-xl bg-gray-700 p-3">
                                    <span
                                        onMouseOver={() => setShow(true)}
                                        onMouseOut={() => setShow(false)}
                                    >
                                        <>
                                            {!show && data
                                                ? "*".repeat(`${data.apiKey}`.length)
                                                : data?.apiKey}

                                            {!data && "None"}
                                        </>
                                    </span>
                                    <button
                                        className="rounded-xl p-2 hover:bg-gray-600"
                                        onClick={() => createToast()}
                                    >
                                        {!isCopy ? <FaClipboard /> : <FaClipboardCheck />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Toaster
                toastOptions={{
                    duration: 2000,
                    style: { borderRadius: "10px", background: "#262626", color: "#E8DCFF" },
                }}
            />
        </article>
    );
};

export default UserPage;
