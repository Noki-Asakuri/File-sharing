import { useSession } from "next-auth/react";
import React from "react";

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex w-full h-screen justify-center items-center">
                <h1 className="text-xl">
                    Loading ...
                </h1>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;
