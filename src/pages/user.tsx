import type { NextPage } from "next";
import { useSession } from "next-auth/react";

const UserPage: NextPage = () => {
    const { data: session } = useSession();

    return (
        <div className="flex w-full h-[90vh] justify-center items-center">
            {session?.user.role === "Admin" ? (
                <h1 className="text-xl text-blue-500">
                    Error 404: Fix this pls?
                </h1>
            ) : (
                <h1 className="text-xl text-red-500">Error 404: W.I.P</h1>
            )}
        </div>
    );
};

export default UserPage;
