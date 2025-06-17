import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "../../stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { Input } from "@/modules/core/components/ui/Input";
import { useState } from "react";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { validateSequenceId } from "@/modules/core/helpers/validateSequenceId";
import { useGetAllCases } from "@/modules/core/hooks/database/cases/useGetAllCases";
import { cn } from "@/modules/core/helpers/cn";

export const SequenceMappingDialog = () => {
    const sequenceMappingDialogCase = useDataManagementStore((state) => state.sequenceMappingDialogCase);
    const hideSequenceMappingDialog = useDataManagementStore((state) => state.hideSequenceMappingDialog);
    const updateCasesWithRelationships = useCoreStore((state) => state.updateCasesWithRelationships);
    const [isTouched, setIsTouched] = useState(false);
    const [sequenceId, setSequenceId] = useState("");
    const cases = useGetAllCases();
    const { isSequenceIdValid, sequenceIdPatternIsValid, isUniqueSequenceId } = validateSequenceId(cases, sequenceId);

    if (!sequenceMappingDialogCase) return;
    const mapSequenceIdToCase = async () => {
        if (sequenceId !== "") {
            await db.cases.update(sequenceMappingDialogCase.id, { fasta_id: sequenceId });
            updateCasesWithRelationships();
        }
        hideSequenceMappingDialog();
    };
    return (
        <Dialog open onOpenChange={hideSequenceMappingDialog}>
            <DialogContent className="w-[350px]">
                <DialogHeader>
                    <DialogTitle>Sequenz ID zuweisen</DialogTitle>
                    <DialogDescription>
                        Weisen sie dem Fall <i>{sequenceMappingDialogCase?.case_id}</i> eine Sequenz ID zu.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    id="fasta_id"
                    value={sequenceId}
                    className={cn("w-full", !isSequenceIdValid() && "focus-visible:ring-red-500")}
                    placeholder={sequenceMappingDialogCase?.fasta_id ?? ""}
                    onChange={(e) => setSequenceId(e.target.value)}
                    onFocus={() => setIsTouched(true)}
                    autoFocus
                />

                {isTouched && !isUniqueSequenceId() && (
                    <p className="text-red-500 text-sm -mt-2">Die Sequenz ID ist bereits vergeben.</p>
                )}
                {isTouched && !sequenceIdPatternIsValid() && (
                    <p className="text-red-500 text-sm -mt-2">Die eingegebene Sequenz ID besitzt unerlaubte Zeichen.</p>
                )}
                <DialogFooter>
                    <Button type="button" disabled={!isSequenceIdValid()} onClick={mapSequenceIdToCase}>
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
