import { Label } from "../ui/label";

type CaseInfoItemProps = {
    label: string;
    description: string;
};

export const CaseInfoItem = ({ label, description }: CaseInfoItemProps) => {
    return (
        <div className="flex items-center space-x-1">
            <Label htmlFor="nodeLabel">{label}:</Label>
            <p className="font-normal text-sm">{description}</p>
        </div>
    );
};
