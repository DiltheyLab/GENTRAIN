import { Badge } from "@/modules/core/components/ui/Badge";
import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { CustomTooltip } from "@/modules/core/components/ui/CustomTooltip";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { Label } from "@/modules/core/components/ui/Label";
import { deleteDatabase } from "@/modules/core/hooks/database/useDatabaseDeletion";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useDataManagementStore } from "../../stores/dataManagement";

export const TTLHOURS = 24;

export const DataDeletionOptions = () => {
    const indexedDbExpiresAt = useDataManagementStore((state) => state.indexedDbExpiresAt);
    const setIndexedDbExpiresAt = useDataManagementStore((state) => state.setIndexedDbExpiresAt);
    const setDeleteIndexedDbOnExit = useDataManagementStore((state) => state.setDeleteIndexedDbOnExit);
    const deleteIndexedDbOnExit = useDataManagementStore((state) => state.deleteIndexedDbOnExit);

    const renderExpirationBadge = () => {
        if (!indexedDbExpiresAt) return null;

        const date = new Date(indexedDbExpiresAt);
        return (
            <Badge className="bg-accent hover:bg-accent text-black">
                <div className="grid p-1 place-items-center text-center">
                    <p className="font-light">Autom. Löschung am</p>
                    <p> {`${date.toLocaleDateString()}, ${date.toLocaleTimeString()} Uhr`}</p>
                </div>
            </Badge>
        );
    };

    const handleDatabaseExpiration = (checked: CheckedState) => {
        if (checked) {
            setIndexedDbExpiresAt(TTLHOURS);
        } else {
            setIndexedDbExpiresAt(null); //deactivate expiration
        }
    };

    return (
        <div className="flex flex-col gap-5 mt-6">
            <div className="flex gap-7 items-center">
                <Label className="flex items-start gap-3">
                    <Checkbox
                        checked={Boolean(indexedDbExpiresAt)}
                        onCheckedChange={(checked) => handleDatabaseExpiration(checked)}
                    />
                    <div className="font-normal text-base leading-none grid gap-2">
                        <div className="flex gap-2">
                            <p className="font-medium">Zeitlich begrenzte Datenspeicherung ({TTLHOURS} Stunden)</p>
                            <CustomTooltip
                                classname="-mt-1"
                                content={
                                    <p>
                                        Für Ihre Datenbank wird eine{" "}
                                        <strong>Lebensdauer (TTL) von {TTLHOURS} Stunden</strong> gesetzt. Das bedeutet:
                                        Nach Ablauf dieser Zeitspanne wird die Datenbank ungültig und enthaltene Daten
                                        werden entfernt. Sollte die Anwendung zu diesem Zeitpunkt geschlossen sein, wird
                                        die Datenlöschung aus technischen Gründen beim nächsten Start der Anwendung
                                        durchgeführt.
                                    </p>
                                }
                            />
                        </div>
                        <p className="text-muted-foreground">
                            Nach Ablauf der {TTLHOURS} Stunden wird die Datenbank ungültig und schnellstmöglich
                            gelöscht. Wenn Sie die Einstellung ändern, wird die {TTLHOURS}-Stunden-Frist zurückgesetzt.
                        </p>
                    </div>
                </Label>
                {renderExpirationBadge()}
            </div>
            <Label className="flex items-start gap-3">
                <Checkbox
                    checked={deleteIndexedDbOnExit}
                    onCheckedChange={(checked) => setDeleteIndexedDbOnExit(Boolean(checked))}
                />
                <div className="font-normal text-base leading-none grid gap-2">
                    <div className="flex gap-2">
                        <p className="font-medium">Daten nur für die aktuelle Sitzung speichern</p>
                        <CustomTooltip
                            classname="-mt-1"
                            content={
                                <p>
                                    Sobald Sie das Browserfenster schließen, die Anwendung beenden oder die Seite neu
                                    laden, werden alle gespeicherten Daten aus der Datenbank entfernt.
                                </p>
                            }
                        />
                    </div>
                    <p className="text-muted-foreground">
                        Diese Einstellung sorgt für eine flüchtige Speicherung: Die Daten existieren nur solange die
                        aktuelle Sitzung läuft. Beim Schließen oder Neuladen gehen sie automatisch verloren.{" "}
                    </p>
                </div>
            </Label>
            <DeleteDialog
                triggerComponent={
                    <Button variant="destructive" className="w-fit">
                        Alle Daten löschen
                    </Button>
                }
                deleteAction={() => deleteDatabase({ reloadPage: true })}
                dialogTitle="Alle Daten unwiderruflich löschen"
                dialogDescription="Dieser Vorgang kann nicht rückgängig gemacht werden! Dadurch werden alle Daten in GENTRAIN dauerhaft gelöscht."
            />
        </div>
    );
};
