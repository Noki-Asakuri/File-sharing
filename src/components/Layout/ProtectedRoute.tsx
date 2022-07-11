import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            setTimeout(() => router.push("/"), 3000);
        }
    }, [router, status]);

    if (status === "unauthenticated") {
        return (
            <div className="flex w-full h-screen justify-center items-center">
                <h1 className="text-xl text-red-500">
                    Error 401: Unauthenticated. Redirecting ...
                </h1>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
