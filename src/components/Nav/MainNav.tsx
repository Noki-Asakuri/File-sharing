import { signIn, useSession } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import React from "react";
import { FaGithub, FaSignInAlt } from "react-icons/fa";
import Dropdown from "./Dropdown";

const LoginProfile: React.FC = () => {
    const { data: session } = useSession();

    if (session) {
        return (
            <Dropdown>
                <Image
                    src={session.user.image}
                    alt={"Discord profile image"}
                    width="44"
                    height="44"
                />
            </Dropdown>
        );
    }

    return (
        <div className="rounded-lg bg-slate-600">
            <button onClick={() => signIn("discord")}>
                <span className="flex items-center gap-x-2 p-3">
                    Login <FaSignInAlt />
                </span>
            </button>
        </div>
    );
};

const Navbar: React.FC = () => {
    return (
        <nav className="absolute z-50 w-full">
            <div className="bg-gray-800/60">
                <div className="mx-auto flex max-w-7xl justify-between px-4 py-2">
                    <div className="flex items-center text-3xl tracking-wider text-blue-500">
                        <Link href={"/"}>Home</Link>
                    </div>
                    <div className="flex items-center justify-center gap-x-5">
                        <div>
                            <a
                                className="relative h-max w-max text-[0px]"
                                href="https://github.com/iahacker123/File-sharing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="absolute">Github</span>
                                <FaGithub className="h-11 w-11 rounded-full transition-colors hover:text-sky-500" />
                            </a>
                        </div>
                        <LoginProfile />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
