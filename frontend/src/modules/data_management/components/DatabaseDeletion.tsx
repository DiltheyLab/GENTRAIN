import { Button } from "@/modules/core/components/ui/Button";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { db } from "@/modules/core/infrastructure/database";

export const DatabaseDeletion = () => {
    const { toast } = useToast();
    const deleteDatabase = async () => {
        try {
            await db.delete();
            toast({
                title: "Daten gelöscht",
                description: "Die Daten wurden erfolgreich gelöscht",
                duration: 5000,
                variant: "success",
            });
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
        <div>
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
