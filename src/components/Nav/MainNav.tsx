import React from "react";
import { FaGithub, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const LoginProfile: React.FC<{}> = ({}) => {
    const data = useSession();

    const { data: session } = data;

    console.log(data);

    if (session) {
        return (
            <>
                <div className="bg-slate-600 p-3 rounded-lg">
                    <div>
                        <span>{session.user?.name}</span>
                    </div>
                </div>
                <div className="bg-slate-600 p-3 rounded-lg">
                    <button onClick={() => signOut()}>
                        <span className="flex justify-center items-center gap-x-2">
                            Logout <FaSignOutAlt />
                        </span>
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="bg-slate-600 p-3 rounded-lg">
            <button onClick={() => signIn()}>
                <span className="flex justify-center items-center gap-x-2">
                    Login <FaSignInAlt />
                </span>
            </button>
        </div>
    );
};

const Navbar: React.FC<{}> = ({}) => {
    return (
        <nav className="font-normal bg-slate-800">
            <div className="max-w-7xl mx-auto my-0 flex justify-between py-2">
                <div className="text-3xl tracking-wider text-blue-500 flex justify-center items-center">
                    <Link href={"/"}>Freunds</Link>
                </div>
                <div className="flex justify-center items-center gap-x-5">
                    <div className="bg-slate-600 p-3 rounded-lg">
                        <a
                            href="https://github.com/iahacker123/File-sharing"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="flex justify-center items-center gap-x-2">
                                Github
                                <FaGithub />
                            </span>
                        </a>
                    </div>

                    <LoginProfile />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
