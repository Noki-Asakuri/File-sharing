import { useRouter } from "next/router";
import React, { useEffect } from "react";

const FourOhFourPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push("/");
        }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex w-full h-screen justify-center items-center">
            <h1 className="text-xl text-red-500">
                Error 404: No page found. Redirecting ...
            </h1>
        </div>
    );
};

export default FourOhFourPage;
