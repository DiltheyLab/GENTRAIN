import { Button } from "@/modules/core/components/ui/Button";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { toast } from "@/modules/core/components/ui/UseToast";
import { db } from "@/modules/core/infrastructure/database";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { forwardRef } from "react";

type AnalysisDeleteAlertDialogProps = {
    row: Row<AnalysisSchema>;
};

export const AnalysisDeleteAlertDialog = forwardRef<HTMLButtonElement, AnalysisDeleteAlertDialogProps>(
    ({ row }, ref) => {
        const deleteAnalysis = async () => {
            try {
                await db.analyses.delete(row.original.id);
                toast({
                    title: "Analyse gelöscht",
                    description: "Die Analyse wurde erfolgreich gelöscht.",
                    duration: 5000,
                });
            } catch (error) {
                toast({
                    title: "Fehler beim Löschen der Analyse",
                    description: "Die Analyse konnte nicht gelöscht werden. Bitte versuche es erneut.",
                    duration: 10000,
                    variant: "destructive",
                });
                console.error("Error while deleting analysis", error);
            }
        };
        return (
            <DeleteDialog
                deleteAction={deleteAnalysis}
                dialogTitle="Analyse löschen"
                dialogDescription="Dieser Vorgang kann nicht rückgängig gemacht werden. Dadurch wird Ihre Analyse dauerhaft
                        gelöscht."
                triggerComponent={
                    <Button ref={ref} size={"icon"} variant={"secondary"} title="Analyse löschen">
                        <Trash2 size={15} />
                    </Button>
                }
            />
        );
    }
);

AnalysisDeleteAlertDialog.displayName = "AnalysisDeleteDialog";
