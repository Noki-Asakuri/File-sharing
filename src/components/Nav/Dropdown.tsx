import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaSignOutAlt, FaHome, FaUserCog, FaCogs } from "react-icons/fa";

const DropdownItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <DropdownMenu.Item className="transition-colors rounded-md focus:bg-slate-800 focus:outline-none">
            {children}
        </DropdownMenu.Item>
    );
};

const Dropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild className="rounded-full">
                {children}
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                className="bg-gradient-to-t from-slate-800 to-slate-900 min-w-[170px] p-4 rounded-lg radix-state-open:animate-fadeIn radix-state-closed:animate-fadeOut drop-shadow-lg"
                sideOffset={5}
                loop
            >
                <DropdownMenu.Label className="flex items-center justify-center px-2 pb-2">
                    {session?.user?.name}
                </DropdownMenu.Label>
                <DropdownMenu.Separator className="h-px my-1 bg-white" />
                <DropdownItem>
                    <Link href={"/"} passHref>
                        <a className="w-full">
                            <div className="flex items-center justify-between p-2">
                                Home <FaHome />
                            </div>
                        </a>
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href={"/dashboard"} passHref>
                        <a className="w-full">
                            <div className="flex items-center justify-between p-2">
                                Dashboard <FaCogs />
                            </div>
                        </a>
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href={"/user"} passHref>
                        <a className="w-full">
                            <div className="flex items-center justify-between p-2">
                                User <FaUserCog />
                            </div>
                        </a>
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <button className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
                        <span className="flex items-center justify-between p-2 gap-x-2">
                            Logout <FaSignOutAlt />
                        </span>
                    </button>
                </DropdownItem>
                <DropdownMenu.Arrow className="fill-slate-700" offset={12} />
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default Dropdown;
