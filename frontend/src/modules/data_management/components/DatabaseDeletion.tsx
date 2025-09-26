import { DataDeletionOptions } from "./data_deletion/DataDeletionOptions";

export const DatabaseDeletion = () => {
    return (
        <div data-tutorial-tour-step="data-management-delete-data-section" className="bg-white rounded-xl p-3">
            <h2 className="text-2xl font-bold tracking-tight">Datenlöschung</h2>
            <p className="text-muted-foreground mb-4">
                Hier finden Sie Optionen zur Datenlöschung.{" "}
                <strong>
                    {" "}
                    Standardmäßig ist die automatische Datenlöschung aktiv, welche die Daten 24 Stunden nach dem Import
                    automatisch löscht.
                </strong>{" "}
                Zusätzlich haben Sie die Möglichkeit eine striktere Löschung zu aktivieren, um die Daten schon beim
                Schließen der Seite zu entfernen. Sie können die Daten auch jederzeit manuell löschen. Bei der Löschung
                werden alle lokal gespeicherten Daten entfernt, das inkludiert auch die Daten aller Pathogene.
            </p>

            <DataDeletionOptions />
        </div>
    );
};
