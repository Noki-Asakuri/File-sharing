import * as Toast from "@radix-ui/react-toast";
import { FaCheck } from "react-icons/fa";

// backgroundColor: 'white',
// borderRadius: 6,
// boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
// padding: 15,
// display: 'grid',
// gridTemplateAreas: '"title action" "description action"',
// gridTemplateColumns: 'auto max-content',
// columnGap: 15,
// alignItems: 'center',

const CopytoClipboardToast: React.FC<{
    Popup: boolean;
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}> = ({ Popup, setPopup, children }) => {
    return (
        <Toast.Provider swipeDirection="right">
            {children}

            <Toast.Root
                open={Popup}
                onOpenChange={setPopup}
                className="bg-slate-600 rounded-md p-4 items-center"
            >
                <Toast.Title>
                    <div
                        className={`flex justify-center items-center gap-x-2 [&:data-state="open"]:bg-black`}
                    >
                        Copied url to clipboard! <FaCheck />
                    </div>
                </Toast.Title>
            </Toast.Root>

            <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-3 w-96 max-w-[100vw] m-0 list-none z-50 outline-none" />
        </Toast.Provider>
    );
};

export default CopytoClipboardToast;
