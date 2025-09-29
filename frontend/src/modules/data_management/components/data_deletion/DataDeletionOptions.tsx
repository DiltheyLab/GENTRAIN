import { Badge } from "@/modules/core/components/ui/Badge";
import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { CustomTooltip } from "@/modules/core/components/ui/CustomTooltip";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { Label } from "@/modules/core/components/ui/Label";
import { deleteDatabase, useDatabaseDeletion } from "@/modules/core/hooks/database/useDatabaseDeletion";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useDataManagementStore } from "../../stores/dataManagement";

export const DataDeletionOptions = () => {
    const indexedDbExpiresAt = useDataManagementStore((state) => state.indexedDbExpiresAt);
    const setIndexedDbExpiresAt = useDataManagementStore((state) => state.setIndexedDbExpiresAt);
    const setIndexedDBDeletionOnExitIsActive = useDataManagementStore(
        (state) => state.setIndexedDBDeletionOnExitIsActive
    );
    const indexedDBDeletionOnExitIsActive = useDataManagementStore((state) => state.indexedDBDeletionOnExitIsActive);

    useDatabaseDeletion();

    const renderExpirationBadge = () => {
        if (!indexedDbExpiresAt) return null;

        const date = new Date(indexedDbExpiresAt);
        return (
            <Badge className="bg-accent hover:bg-accent text-black -mt-4">
                <div className="grid p-1 place-items-center">
                    <p className="font-light">Automatische Löschung am</p>
                    <p> {`${date.toLocaleDateString()}, ${date.toLocaleTimeString()} Uhr`}</p>
                </div>
            </Badge>
        );
    };

    const handleDatabaseExpiration = (checked: CheckedState) => {
        if (checked) {
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            const newDate = Date.now() + oneDayInMilliseconds;
            console.log(newDate);

            setIndexedDbExpiresAt(newDate);
        } else {
            setIndexedDbExpiresAt(null);
        }
    };

    return (
        <div className="flex flex-col gap-5 mt-3">
            <div className="flex gap-7 items-end">
                <Label className="flex items-start gap-3">
                    <Checkbox defaultChecked onCheckedChange={(checked) => handleDatabaseExpiration(checked)} />
                    <div className="font-normal text-base leading-none grid gap-2">
                        <div className="flex gap-2">
                            <p className="font-medium">Automatische Datenlöschung nach 24 Stunden</p>
                            <CustomTooltip
                                classname="-mt-1"
                                content={
                                    <p>
                                        Für Ihre Daten wird eine <strong>Lebensdauer (TTL)</strong> von 24 Stunden
                                        gesetzt. <br /> Das bedeutet: Nach Ablauf dieser Zeitspanne sind die Daten
                                        ungültig. Sie bleiben zwar technisch noch auf der Festplatte gespeichert, werden
                                        aber beim nächsten Start der Anwendung automatisch entfernt, sollte die
                                        Lebensdauer überschritten sein.
                                    </p>
                                }
                            />
                        </div>
                        <p className="text-muted-foreground">
                            Sie können die Datenlöschung jederzeit ändern. Dabei wird der Löschzeitpunkt neu festgelegt.
                        </p>
                    </div>
                </Label>
                {renderExpirationBadge()}
            </div>
            <Label className="flex items-start gap-3">
                <Checkbox
                    checked={indexedDBDeletionOnExitIsActive}
                    onCheckedChange={(checked) => setIndexedDBDeletionOnExitIsActive(Boolean(checked))}
                />
                <div className="font-normal text-base leading-none grid gap-2">
                    <div className="flex gap-2">
                        <p className="font-medium">Automatische Datenlöschung beim Beenden der Anwendung</p>
                        <CustomTooltip
                            classname="-mt-1"
                            content={
                                <p>
                                    Sobald Sie das Browserfenster oder die Anwendung schließen, werden alle
                                    gespeicherten Daten aus der Datenbank entfernt. Im Gegensatz zur zeitbasierten
                                    Löschung (24 Stunden) bleiben die Daten hier nicht länger bestehen, sondern werden
                                    unmittelbar beim Beenden gelöscht.
                                </p>
                            }
                        />
                    </div>
                    <p className="text-muted-foreground">
                        Die Daten werden automatisch gelöscht, wenn Sie das Fenster oder den Browser schließen.
                    </p>
                </div>
            </Label>
            <DeleteDialog
                triggerComponent={<Button variant="destructive">Alle Daten löschen</Button>}
                deleteAction={deleteDatabase}
                dialogTitle="Alle Daten un­wi­der­ruf­lich löschen"
                dialogDescription="Dieser Vorgang kann nicht rückgängig gemacht werden! Dadurch werden alle Daten in GENTRAIN dauerhaft gelöscht."
            />
        </div>
    );
};
