import { Button } from "@/modules/core/components/ui/Button";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { useNavigate } from "react-router-dom";

export const DatabaseDeletion = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const deleteDatabase = async () => {
        try {
            await db.delete();
            localStorage.removeItem("core");
            localStorage.removeItem("selectedDB");
            navigate("/");
            location.reload();
        } catch (error) {
            toast({
                title: "Daten konnten nicht gelöscht werden!",
                description: "Laden Sie die Anwendung erneut und versuchen Sie es noch einmal",
                duration: 10000,
                variant: "destructive",
            });
            console.log(error);
        }
    };
    return (
        <div data-tutorial-tour-step="data-management-delete-data-section" className="bg-white rounded-xl p-3">
            <h2 className="text-2xl font-bold tracking-tight">Alle Daten löschen</h2>
            <p className="text-muted-foreground mb-4">
                Hier können Sie alle bereits importierten Daten löschen. Dies schließt Daten aller Pathogen ein. Diese
                Aktion setzt den gesamten Status der Anwendung zurück und{" "}
                <strong>löscht alle lokal gespeicherten Daten</strong>.
            </p>
            <DeleteDialog
                triggerComponent={<Button variant="destructive">Alle Daten löschen</Button>}
                deleteAction={deleteDatabase}
                dialogTitle="Alle Daten un­wi­der­ruf­lich löschen"
                dialogDescription="Dieser Vorgang kann nicht rückgängig gemacht werden! Dadurch werden alle Daten in GENTRAIN dauerhaft gelöscht."
            />
        </div>
    );
};
