import { useSession } from "next-auth/react";
import React from "react";

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status } = useSession();

    if (status === "loading") {
        return (
            <>
                <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-[#333] z-50">
                    <img className="w-20 h-auto" src="/loading.svg" alt="Loading image" />
                </div>
                {children}
            </>
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;
