import * as Toast from "@radix-ui/react-toast";
import { FaCheck } from "react-icons/fa";

const CopytoClipboardToast: React.FC<{
    popup: boolean;
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    name: "password" | "url";
}> = ({ popup, setPopup, children, name }) => {
    return (
        <Toast.Provider swipeDirection="right">
            {children}

            <Toast.Root
                open={popup}
                onOpenChange={setPopup}
                className="bg-slate-600 rounded-md p-4 items-center"
            >
                <Toast.Title>
                    <div
                        className={`flex justify-center items-center gap-x-2 [&:data-state="open"]:bg-black`}
                    >
                        Copied {name} to clipboard! <FaCheck />
                    </div>
                </Toast.Title>
            </Toast.Root>

            <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-3 w-96 max-w-[100vw] m-0 list-none z-50 outline-none" />
        </Toast.Provider>
    );
};

export default CopytoClipboardToast;
