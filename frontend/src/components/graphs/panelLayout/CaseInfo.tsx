import { Button } from "../../ui/button";
import { X } from "lucide-react";
import { CaseWithRelationships } from "@/database/cases";
import { CaseInfoItem } from "./CaseInfoItem";
import { useTranslation } from "react-i18next";

type CaseInfoProps = {
    selectedCase: CaseWithRelationships | null;
    updateSelectedCase: (selectedCase: CaseWithRelationships | null) => void;
};

export const CaseInfo = ({ selectedCase, updateSelectedCase }: CaseInfoProps) => {
    const { t } = useTranslation();

    if (!selectedCase) return;

    return (
        <fieldset className="absolute z-10 right-2 bottom-2 rounded-lg border p-4 max-w-[35%] bg-muted/80 pointer-events-none">
            <legend className="-ml-1 px-1 text-sm font-medium">Informationen</legend>
            <Button
                className="absolute -top-[17px] right-1 hover:bg-inherit hover:text-primary bg-inherit rounded-full h-4 -px-1 pointer-events-auto"
                type="button"
                size="sm"
                variant={"ghost"}
                onClick={() => updateSelectedCase(null)}
            >
                <X size={23} className="text-slate-700" />
            </Button>
            <div className="flex flex-col gap-1">
                <CaseInfoItem label="Fall ID" description={selectedCase.case_id} copyToClipboard />
                <CaseInfoItem
                    label="Sequenz ID"
                    description={selectedCase.sample?.fasta_id ?? "keine Sequenz vorhanden"}
                />
                <CaseInfoItem
                    label="Ausbruch"
                    description={selectedCase.outbreak?.name ?? t("clusterTypes.noOutbreakAssigned")}
                />
                <CaseInfoItem
                    label="Registrierungsdatum"
                    description={selectedCase.registered_at.toLocaleDateString()}
                />
                <CaseInfoItem
                    label="Gruppen"
                    description={
                        selectedCase.groups?.map((group) => group.name).join(", ") ?? "Keiner Gruppe zugewiesen"
                    }
                />
            </div>
        </fieldset>
    );
};
