import { useSession } from "next-auth/react";

import LoadingImage from "../Svg/Loading";

const protectedRoute: string[] = ["/dashboard", "/user"];

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status } = useSession();
    // const router = useRouter();

    return (
        <>
            {status === "loading" && (
                <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gradient-to-br from-[#5b6367] to-[#323240]">
                    <LoadingImage />
                </div>
            )}
            {children}
        </>
    );
};

export default AuthWrapper;
