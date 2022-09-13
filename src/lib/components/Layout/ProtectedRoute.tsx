import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { push: redirect } = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            setTimeout(() => redirect("/"), 3000);
        }
    }, [redirect, status]);

    if (status === "unauthenticated") {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="relative flex flex-col items-center justify-center rounded-2xl bg-opacity-75 bg-gradient-to-tl from-slate-800 to-slate-900 drop-shadow-lg">
                    <div className="w-[400px] p-7">
                        <h2 className="flex items-center justify-center gap-2 pb-6 text-4xl text-red-500">
                            <FaExclamationTriangle />
                            Error 401
                        </h2>
                        <div className="flex flex-col items-center justify-center">
                            <span>Unauthenticated. Redirecting...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
