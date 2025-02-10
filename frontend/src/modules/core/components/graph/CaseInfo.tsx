import { Button } from "@/modules/core/components/ui/Button";
import { X } from "lucide-react";
import { CaseInfoItem } from "./CaseInfoItem";
import { CustomNode } from "../../types/graph";

type CaseInfoProps = {
    selectedNode: CustomNode | null;
    updateSelectedNode: (selectedNode: CustomNode | null) => void;
};
export const CaseInfo = ({ selectedNode, updateSelectedNode }: CaseInfoProps) => {
    if (!selectedNode) return null;

    // format name respecting available data
    const renderCaseName = () => {
        if (!selectedNode.caseData.first_name && !selectedNode.caseData.last_name) return;
        const firstAndLastName = [selectedNode.caseData.first_name, selectedNode.caseData.last_name]
            .filter((addressValue) => addressValue)
            .join(" ");
        return <CaseInfoItem label="Name" description={firstAndLastName} />;
    };

    // format address respecting available data
    const renderCaseAddress = () => {
        if (!selectedNode.caseData.city && !selectedNode.caseData.zip_code && !selectedNode.caseData.street) return;
        const cityAndZipCode = [selectedNode.caseData.zip_code, selectedNode.caseData.city]
            .filter((addressValue) => addressValue)
            .join(" ");
        const address = [cityAndZipCode, selectedNode.caseData.street]
            .filter((addressValue) => addressValue)
            .join(", ");

        return <CaseInfoItem label="Addresse" description={address} />;
    };

    return (
        <fieldset className="absolute z-[11] right-2 bottom-2 rounded-lg border p-4 max-w-[35%] bg-muted/90 pointer-events-none">
            <legend className="-ml-1 px-1 text-sm font-medium">Informationen</legend>
            <Button
                className="absolute -top-[17px] right-1 hover:bg-inherit bg-inherit rounded-full h-4 -px-1 pointer-events-auto"
                type="button"
                size="sm"
                variant={"ghost"}
                onClick={() => updateSelectedNode(null)}
            >
                <X size={23} className="text-slate-700 hover:text-primary " />
            </Button>
            <div className="flex flex-col gap-1 -mt-1">
                <CaseInfoItem label="Fall ID" description={selectedNode.caseData.case_id} copyToClipboard />
                {selectedNode.caseData.sample?.fasta_id ? (
                    <CaseInfoItem label="Sequenz ID" description={selectedNode.caseData.sample?.fasta_id} />
                ) : null}
                {selectedNode.caseData.outbreak ? (
                    <CaseInfoItem label="Ausbruch" description={selectedNode.caseData.outbreak.name} />
                ) : null}
                <CaseInfoItem
                    label="Registrierungsdatum"
                    description={selectedNode.caseData.registered_at.toLocaleDateString()}
                />
                {renderCaseName()}
                {renderCaseAddress()}
                {selectedNode.caseData.groups?.map((group) => {
                    if (!group.category) {
                        return;
                    }
                    return (
                        <CaseInfoItem
                            key={`${selectedNode.caseData.case_id}_${group.category}_${group.name}`}
                            label={group.category.name}
                            description={group.name}
                        />
                    );
                })}
            </div>
        </fieldset>
    );
};
