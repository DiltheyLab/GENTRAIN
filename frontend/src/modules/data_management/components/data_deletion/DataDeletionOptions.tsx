import { Badge } from "@/modules/core/components/ui/Badge";
import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { Label } from "@/modules/core/components/ui/Label";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { CheckedState } from "@radix-ui/react-checkbox";

export const DataDeletionOptions = () => {
    const { toast } = useToast();
    const indexedDbExpiresAt = useCoreStore((state) => state.indexedDbExpiresAt);
    const setIndexedDbExpiresAt = useCoreStore((state) => state.setIndexedDbExpiresAt);
    const setDeleteIndexedDbOnExit = useCoreStore((state) => state.setDeleteIndexedDbOnExit);

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

    const deleteDatabase = async () => {
        try {
            await db.delete();
            localStorage.removeItem("core");
            localStorage.removeItem("selectedDB");
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
        <div className="flex flex-col gap-5 mt-3">
            <div className="flex gap-7 items-end">
                <Label className="flex items-start gap-3">
                    <Checkbox defaultChecked onCheckedChange={(checked) => handleDatabaseExpiration(checked)} />
                    <div className="font-normal text-base leading-none grid gap-2">
                        <p className="font-medium">Automatische Datenlöschung nach 24 Stunden</p>
                        <p className="text-muted-foreground">
                            Sie können die Datenlöschung jederzeit ändern. Dabei wird der Löschzeitpunkt neu festgelegt.
                        </p>
                    </div>
                </Label>
                {renderExpirationBadge()}
            </div>
            <Label className="flex items-start gap-3">
                <Checkbox onCheckedChange={(checked) => setDeleteIndexedDbOnExit(Boolean(checked))} />
                <div className="font-normal text-base leading-none grid gap-2">
                    <p className="font-medium">Automatische Datenlöschung beim Beenden der Anwendung</p>
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
