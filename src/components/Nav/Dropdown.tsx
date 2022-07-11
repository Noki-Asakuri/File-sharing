import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaSignOutAlt, FaHome, FaUserCog, FaCogs } from "react-icons/fa";

const DropdownItem: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <DropdownMenu.Item className="focus:bg-slate-800 focus:outline-none rounded-md transition-colors">
            {children}
        </DropdownMenu.Item>
    );
};

const Dropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild className="rounded-full">{children}</DropdownMenu.Trigger>

            <DropdownMenu.Content
                className="bg-slate-700 p-4 rounded-lg radix-state-open:animate-fadeIn radix-state-closed:animate-fadeOut"
                sideOffset={5}
                loop
            >
                <DropdownMenu.Label className="px-2 pb-2">
                    {session?.user?.name}
                </DropdownMenu.Label>
                <DropdownMenu.Separator className="h-px my-1 bg-white" />
                <DropdownItem>
                    <Link href={"/"} passHref>
                        <a className="w-full">
                            <div className="flex justify-between items-center p-2">
                                Home <FaHome />
                            </div>
                        </a>
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href={"/dashboard"} passHref>
                        <a className="w-full">
                            <div className="flex justify-between items-center p-2">
                                Dashboard <FaCogs />
                            </div>
                        </a>
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href={"/user"} passHref>
                        <a className="w-full">
                            <div className="flex justify-between items-center p-2">
                                User <FaUserCog />
                            </div>
                        </a>
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <button className="w-full" onClick={() => signOut({ callbackUrl: "/"})}>
                        <span className="flex justify-between items-center gap-x-2 p-2">
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
