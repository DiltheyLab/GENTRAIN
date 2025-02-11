import { CopyToClipboardButton } from "@/modules/core/components/ui/CopyToClipboardButton";
import { Label } from "@/modules/core/components/ui/Label";

type CaseInfoItemProps = {
    label: string;
    description?: string;
    copyToClipboard?: boolean;
};

export const CaseInfoItem = ({ label, description, copyToClipboard = false }: CaseInfoItemProps) => {
    if (!description) return null;
    return (
        <div className="flex space-x-1 pointer-events-auto items-baseline">
            <Label htmlFor="nodeLabel" className="font-normal">
                {label}:
            </Label>
            <div className="flex items-center space-x-1">
                <p className="text-sm">{description}</p>
                {copyToClipboard && <CopyToClipboardButton description={description} />}
            </div>
        </div>
    );
};
