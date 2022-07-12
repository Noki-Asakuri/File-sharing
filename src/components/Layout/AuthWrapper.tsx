import { useSession } from "next-auth/react";
import Image from "next/future/image";
import { useRouter } from "next/router";
import React from "react";
import ProtectedRoute from "./ProtectedRoute";

const protectedRoute: string[] = ["/dashboard", "/user"];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status } = useSession();
    const router = useRouter();

    return (
        <>
            {status === "loading" && (
                <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-[#333] z-50">
                    <Image
                        width="100px"
                        height="100px"
                        src={"/loading.svg"}
                        alt={"Loading image"}
                    />
                </div>
            )}
            {protectedRoute.includes(router.pathname) ? (
                <ProtectedRoute>{children}</ProtectedRoute>
            ) : (
                children
            )}
        </>
    );
};

export default AuthWrapper;
