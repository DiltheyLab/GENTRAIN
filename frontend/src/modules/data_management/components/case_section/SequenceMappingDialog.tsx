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
import { deleteSampleByFastaId } from "@/modules/core/models/samples";

export const SequenceMappingDialog = () => {
    const sequenceMappingDialogCase = useDataManagementStore((state) => state.sequenceMappingDialogCase);
    const hideSequenceMappingDialog = useDataManagementStore((state) => state.hideSequenceMappingDialog);
    const updateCasesWithRelationships = useCoreStore((state) => state.updateCasesWithRelationships);
    const [sequenceId, setSequenceId] = useState("");
    if (!sequenceMappingDialogCase) return;
    const mapSequenceIdToCase = async () => {
        const previousFastaId = sequenceMappingDialogCase.fasta_id;
        await db.cases.update(sequenceMappingDialogCase.id, { fasta_id: sequenceId });
        if (previousFastaId) {
            deleteSampleByFastaId(previousFastaId);
        }
        updateCasesWithRelationships();
        hideSequenceMappingDialog();
    };
    return (
        <Dialog open onOpenChange={hideSequenceMappingDialog}>
            <DialogContent className="w-[350px]">
                <DialogHeader>
                    <DialogTitle>Sequenz ID zuweisen</DialogTitle>
                    <DialogDescription>
                        Weisen sie dem Fall <i>{sequenceMappingDialogCase?.case_id}</i> eine Sequenz ID zu oder ändern
                        sie die bereits zugewiesene Sequence ID.
                    </DialogDescription>
                </DialogHeader>
                <Input
                    id="fasta_id"
                    value={sequenceId}
                    placeholder={sequenceMappingDialogCase?.fasta_id ?? ""}
                    onChange={(e) => setSequenceId(e.target.value)}
                    autoFocus
                />
                <DialogFooter>
                    <Button type="button" onClick={mapSequenceIdToCase}>
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
