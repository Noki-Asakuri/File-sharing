import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { FaExclamationTriangle } from "react-icons/fa";

const FourOhFourPage: NextPage = () => {
    const router = useRouter();

    const [myInterval] = useState(setInterval(() => setDelay(delay - 1), 1000));
    const [delay, setDelay] = useState<number>(3);

    useEffect(() => {
        if (delay <= 0) {
            router.push("/");
        }

        return () => clearInterval(myInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delay]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex h-80 flex-wrap justify-around gap-10 pt-20">
                <div className="relative flex w-max flex-col items-start gap-y-7 rounded-2xl bg-gradient-to-tl from-slate-800 to-slate-900 p-10 drop-shadow-lg">
                    <h2 className="flex w-full items-center justify-center gap-2 pb-6 text-4xl text-red-500">
                        <FaExclamationTriangle />
                        Error 404
                    </h2>
                    <div className="flex flex-col items-center justify-center">
                        <span>Page not found. Redirecting in {delay}.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FourOhFourPage;
