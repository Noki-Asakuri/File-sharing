import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import LoadingImage from "../Svg/Loading";
import ProtectedRoute from "./ProtectedRoute";

const protectedRoute: string[] = ["/dashboard", "/user"];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status } = useSession();
    const router = useRouter();

    return (
        <>
            {status === "loading" && (
                <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gradient-to-br from-[#5b6367] to-[#323240]">
                    <LoadingImage />
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
