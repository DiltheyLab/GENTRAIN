import { Label } from "../../ui/label";
import { CopyToClipboardButton } from "../../ui/CopyToClipboardButton";

type CaseInfoItemProps = {
    label: string;
    description: string;
    copyToClipboard?: boolean;
};

export const CaseInfoItem = ({ label, description, copyToClipboard = false }: CaseInfoItemProps) => {
    return (
        <div className="flex space-x-1 pointer-events-auto items-baseline">
            <Label htmlFor="nodeLabel">{label}:</Label>
            <div className="flex items-center space-x-1">
                <p className="font-normal text-sm">{description}</p>
                {copyToClipboard && <CopyToClipboardButton description={description} />}
            </div>
        </div>
    );
};
