import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { FaExclamationTriangle } from "react-icons/fa";

const UserPage: NextPage = () => {
    const { data: session } = useSession();

    return (
        <div className="flex items-center justify-center w-full h-screen">
            {session?.user.isAdmin ? (
                <div className="flex flex-wrap justify-around gap-10 pt-20 h-80">
                    <div className="relative flex flex-col items-start p-10 gap-y-7 w-max rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 drop-shadow-lg">
                        <h2 className="flex items-center justify-center w-full gap-2 pb-6 text-4xl text-blue-500">
                            <FaExclamationTriangle />
                            Error 503.
                        </h2>
                        <div className="flex flex-col items-center justify-center w-full">
                            <span>Fix this pls</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap justify-around gap-10 pt-20 h-80">
                    <div className="relative flex flex-col items-start p-10 gap-y-7 w-max rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 drop-shadow-lg">
                        <h2 className="flex items-center justify-center w-full gap-2 pb-6 text-4xl text-red-500">
                            <FaExclamationTriangle />
                            Error 503.
                        </h2>
                        <div className="flex flex-col items-center justify-center w-full">
                            <span>Service Unavailable.</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
