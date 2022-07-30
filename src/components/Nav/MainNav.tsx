import React from "react";
import { FaGithub, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/future/image";
import Dropdown from "./Dropdown";

const LoginProfile: React.FC<{}> = ({}) => {
    const { data: session } = useSession();

    if (session) {
        return (
            <Dropdown>
                <button className="flex">
                    <Image
                        className="rounded-full"
                        src={session.user.image as string}
                        alt={"Discord profile image"}
                        width={"44px"}
                        height={"44px"}
                    />
                </button>
            </Dropdown>
        );
    }

    return (
        <div className="rounded-lg bg-slate-600">
            <button onClick={() => signIn("discord")}>
                <span className="flex items-center justify-center p-3 gap-x-2">
                    Login <FaSignInAlt />
                </span>
            </button>
        </div>
    );
};

const Navbar: React.FC<{}> = ({}) => {
    return (
        <nav className="font-normal bg-slate-800">
            <div className="flex justify-between px-4 py-2 mx-auto my-0 max-w-7xl">
                <div className="flex items-center justify-center text-3xl tracking-wider text-blue-500">
                    <Link href={"/"}>File sharing</Link>
                </div>
                <div className="flex items-center justify-center gap-x-5">
                    <div>
                        <a
                            className="flex justify-center items-center gap-x-2 w-max h-max relative text-[0px]"
                            href="https://github.com/iahacker123/File-sharing"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="absolute">Github</span>
                            <FaGithub className="relative z-50 transition-colors rounded-full w-11 h-11 hover:text-sky-700" />
                        </a>
                    </div>

                    <LoginProfile />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
