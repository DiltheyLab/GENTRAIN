import { DataDeletionOptions, TTLHOURS } from "./data_deletion/DataDeletionOptions";

export const DatabaseDeletion = () => {
    return (
        <div data-tutorial-tour-step="data-management-delete-data-section" className="bg-white rounded-xl p-3">
            <h2 className="text-2xl font-bold tracking-tight">Datenlöschung</h2>
            <p className="text-muted-foreground mb-4">
                Standardmäßig gilt für Ihre lokale Datenbank eine{" "}
                <strong>Lebensdauer (TTL) von {TTLHOURS} Stunden</strong>. Die TTL beginnt, sobald Fall-, Sequenz- oder
                Kontaktpersonendaten importiert wurden.{" "}
                <strong>Nach Ablauf dieser Zeitspanne wird die Datenbank ungültig und automatisch gelöscht.</strong>{" "}
                Sollte die Anwendung zu diesem Zeitpunkt geschlossen sein, wird die Datenlöschung aus technischen
                Gründen beim nächsten Start der Anwendung durchgeführt. Zusätzlich können Sie eine flüchtige Speicherung
                aktivieren. Dabei werden die Daten nur für die aktuelle Sitzung vorgehalten und sofort gelöscht, sobald
                Sie die Seite neu laden oder das Browserfenster schließen. Sie können die Daten außerdem jederzeit
                manuell löschen. Dabei werden alle lokal gespeicherten Daten vollständig entfernt.
            </p>

            <DataDeletionOptions />
        </div>
    );
};
