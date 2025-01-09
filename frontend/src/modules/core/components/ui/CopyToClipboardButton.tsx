import { ClipboardCopy } from "lucide-react";
import { Button } from "./Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";
import { useState } from "react";
import { useTimeout } from "@/modules/core/hooks/useTimeout";

type CopyToClipboardButtonProps = {
    description: string;
};

export const CopyToClipboardButton = ({ description }: CopyToClipboardButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    useTimeout(() => setIsOpen(false), [isOpen]);

    const handleClick = () => {
        navigator.clipboard.writeText(description);
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
                        className="w-4 h-4 hover:bg-slate-200 hover:text-primary"
                        onClick={handleClick}
                    >
                        <ClipboardCopy size={18} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Kopiert</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
