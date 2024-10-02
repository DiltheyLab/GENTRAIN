import { Button } from "@/modules/core/components/ui/Button";
import { X } from "lucide-react";
import { CaseInfoItem } from "./CaseInfoItem";
import { useTranslation } from "react-i18next";
import { CustomNode } from "../../types/graph";

type CaseInfoProps = {
    selectedNode: CustomNode | null;
    updateSelectedNode: (selectedNode: CustomNode | null) => void;
};
export const CaseInfo = ({ selectedNode, updateSelectedNode }: CaseInfoProps) => {
    const { t } = useTranslation();

    if (!selectedNode) return null;

    return (
        <fieldset className="absolute z-10 right-2 bottom-2 rounded-lg border p-4 max-w-[35%] bg-muted/80 pointer-events-none">
            <legend className="-ml-1 px-1 text-sm font-medium">Informationen</legend>
            <Button
                className="absolute -top-[17px] right-1 hover:bg-inherit hover:text-primary bg-inherit rounded-full h-4 -px-1 pointer-events-auto"
                type="button"
                size="sm"
                variant={"ghost"}
                onClick={() => updateSelectedNode(null)}
            >
                <X size={23} className="text-slate-700" />
            </Button>
            <div className="flex flex-col gap-1 -mt-1">
                <CaseInfoItem label="Fall ID" description={selectedNode.caseData.case_id} copyToClipboard />
                <CaseInfoItem
                    label="Sequenz ID"
                    description={selectedNode.caseData.sample?.fasta_id ?? "keine Sequenz vorhanden"}
                />
                <CaseInfoItem
                    label="Ausbruch"
                    description={selectedNode.caseData.outbreak?.name ?? t("clusterTypes.noOutbreakAssigned")}
                />
                <CaseInfoItem
                    label="Registrierungsdatum"
                    description={selectedNode.caseData.registered_at.toLocaleDateString()}
                />
                <CaseInfoItem
                    label="Gruppen"
                    description={
                        selectedNode.caseData.groups?.map((group) => group.name).join(", ") ??
                        "Keiner Gruppe zugewiesen"
                    }
                />
            </div>
        </fieldset>
    );
};
