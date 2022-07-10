import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

const DropdownItem: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <DropdownMenu.Item className="hover:bg-slate-800 focus:outline-none p-2 rounded-md">
            {children}
        </DropdownMenu.Item>
    );
};

const Dropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

            <DropdownMenu.Content
                className="bg-slate-700 p-4 rounded-lg"
                sideOffset={5}
                loop
            >
                <DropdownMenu.Label className="p-2">
                    {session?.user?.name}
                </DropdownMenu.Label>
                <DropdownMenu.Separator className="h-[1px] my-1 bg-white" />
                <DropdownItem>
                    <span>
                        <Link href={"/dashboard"}>Dashboard</Link>
                    </span>
                </DropdownItem>
                <DropdownItem>
                    <span>
                        <Link href={"/user"}>User settings</Link>
                    </span>
                </DropdownItem>
                <DropdownItem>
                    <button onClick={() => signOut()}>
                        <span className="flex justify-center items-center gap-x-2">
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
