import { ClipboardCopy } from "lucide-react";
import { Button } from "./button";
import copy from "copy-to-clipboard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { useState } from "react";
import { useTimeout } from "@/hooks/useTimeout";
type CopyToClipboardButtonProps = {
    description: string;
};

export const CopyToClipboardButton = ({ description }: CopyToClipboardButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    useTimeout(() => setIsOpen(false), [isOpen]);

    const handleClick = () => {
        copy(description);
        setIsOpen(true);
    };

    return (
        <TooltipProvider>
            <Tooltip open={isOpen}>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="w-4 h-4 hover:bg-slate-200"
                        onClick={handleClick}
                    >
                        <ClipboardCopy size={18} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Kopiert!</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
