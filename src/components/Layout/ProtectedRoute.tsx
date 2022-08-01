import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { push: redirect } = useRouter();
    const { status } = useSession();
    const [myTimeout, setMyTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            setMyTimeout(setTimeout(() => redirect("/"), 3000));
        }
    }, [redirect, status]);

    if (status === "unauthenticated") {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="relative flex flex-col items-center justify-center bg-opacity-75 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 drop-shadow-lg">
                    <div className="p-7 w-[400px]">
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
