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
                        src={session.user?.image as string}
                        alt={"Discord profile image"}
                        width={"44px"}
                        height={"44px"}
                    />
                </button>
            </Dropdown>
        );
    }

    return (
        <div className="bg-slate-600 rounded-lg">
            <button onClick={() => signIn()}>
                <span className="flex justify-center p-3 items-center gap-x-2">
                    Login <FaSignInAlt />
                </span>
            </button>
        </div>
    );
};

const Navbar: React.FC<{}> = ({}) => {
    return (
        <nav className="font-normal bg-slate-800">
            <div className="max-w-7xl mx-auto my-0 flex justify-between py-2 px-4">
                <div className="text-3xl tracking-wider text-blue-500 flex justify-center items-center">
                    <Link href={"/"}>Freunds</Link>
                </div>
                <div className="flex justify-center items-center gap-x-5">
                    <div>
                        <a
                            href="https://github.com/iahacker123/File-sharing"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="flex justify-center items-center gap-x-2 w-max h-max">
                                <span className="hidden">Github</span>
                                <FaGithub className="w-11 h-11 rounded-full hover:text-sky-700 transition-colors"/>
                            </div>
                        </a>
                    </div>

                    <LoginProfile />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
