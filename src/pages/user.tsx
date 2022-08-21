import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { FaExclamationTriangle } from "react-icons/fa";

const UserPage: NextPage = () => {
    const { data: session } = useSession();

    return (
        <div className="flex h-screen w-full items-center justify-center">
            {session?.user.isAdmin ? (
                <div className="flex h-80 flex-wrap justify-around gap-10 pt-20">
                    <div className="relative flex w-max flex-col items-start gap-y-7 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 p-10 drop-shadow-lg">
                        <h2 className="flex w-full items-center justify-center gap-2 pb-6 text-4xl text-blue-500">
                            <FaExclamationTriangle />
                            Error 503.
                        </h2>
                        <div className="flex w-full flex-col items-center justify-center">
                            <span>Fix this pls</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-80 flex-wrap justify-around gap-10 pt-20">
                    <div className="relative flex w-max flex-col items-start gap-y-7 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 p-10 drop-shadow-lg">
                        <h2 className="flex w-full items-center justify-center gap-2 pb-6 text-4xl text-red-500">
                            <FaExclamationTriangle />
                            Error 503.
                        </h2>
                        <div className="flex w-full flex-col items-center justify-center">
                            <span>Service Unavailable.</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
