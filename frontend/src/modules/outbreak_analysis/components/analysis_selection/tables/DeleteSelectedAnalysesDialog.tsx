import { Button } from "@/modules/core/components/ui/Button";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { toast } from "@/modules/core/components/ui/UseToast";
import { db } from "@/modules/core/infrastructure/database";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { forwardRef } from "react";

type SelectedAnalysesDeleteDialogProps = {
    selectedAnalyses: Row<AnalysisSchema>[];
    disabled: boolean;
};

export const DeleteSelectedAnalysesDialog = forwardRef<HTMLButtonElement, SelectedAnalysesDeleteDialogProps>(
    ({ selectedAnalyses, disabled }, ref) => {
        const deleteSelectedAnalyses = async () => {
            try {
                const analysesIds = selectedAnalyses.map((analysis) => analysis.original.id);

                await db.analyses.bulkDelete(analysesIds);
                toast({
                    title: "Analysen gelöscht",
                    description: "Die Analysen wurden erfolgreich gelöscht.",
                    duration: 5000,
                });
            } catch (error) {
                toast({
                    title: "Fehler beim Löschen der Analysen",
                    description: "Die Analysen konnte nicht gelöscht werden. Bitte versuche es erneut.",
                    duration: 10000,
                    variant: "destructive",
                });
                console.error("Error while deleting analysis", error);
            }
        };
        return (
            <div className="ml-3">
                <DeleteDialog
                    deleteAction={deleteSelectedAnalyses}
                    dialogTitle="Analysen löschen"
                    dialogDescription="Dieser Vorgang kann nicht rückgängig gemacht werden. Dadurch werden Ihre selektierten Analysen dauerhaft
                        gelöscht."
                    triggerComponent={
                        <Button ref={ref} size={"icon"} variant={"destructive"} disabled={disabled}>
                            <Trash2 size={15} />
                        </Button>
                    }
                />
            </div>
        );
    }
);

DeleteSelectedAnalysesDialog.displayName = "SelectedAnalysesDeleteDialog";
