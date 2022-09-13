import {
    Arrow,
    Content,
    Item,
    Label,
    Root,
    Separator,
    Trigger,
} from "@radix-ui/react-dropdown-menu";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaCogs, FaHome, FaSignOutAlt, FaUserCog } from "react-icons/fa";

const DropdownItem: React.FC<{ children: React.ReactNode; href?: string }> = ({
    children,
    href,
}) => {
    return (
        <Item className="rounded-md transition-colors focus:bg-gray-600 focus:outline-none">
            {href && (
                <Link href={href} passHref>
                    <a className="flex cursor-pointer items-center justify-between p-2">
                        {children}
                    </a>
                </Link>
            )}
            {!href && (
                <button
                    className="flex w-full items-center justify-between gap-x-2 p-2"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    {children}
                </button>
            )}
        </Item>
    );
};

const Dropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();

    return (
        <Root>
            <Trigger className="overflow-hidden rounded-full">{children}</Trigger>
            <Content
                className="min-w-[170px] rounded-xl bg-gradient-to-t from-gray-700 to-gray-800 p-4 radix-state-closed:animate-fadeOut radix-state-open:animate-fadeIn"
                sideOffset={5}
                loop
            >
                <Label className="flex items-center justify-center px-2 pb-2">
                    {session?.user?.name}
                </Label>
                <Separator className="my-1 h-px bg-white" />
                <DropdownItem href={"/"}>
                    Home <FaHome />
                </DropdownItem>
                <DropdownItem href={"/dashboard"}>
                    Dashboard <FaCogs />
                </DropdownItem>
                <DropdownItem href={"/user"}>
                    User <FaUserCog />
                </DropdownItem>
                <DropdownItem>
                    Logout <FaSignOutAlt />
                </DropdownItem>
                <Arrow className="fill-slate-700" offset={12} />
            </Content>
        </Root>
    );
};

export default Dropdown;
