import { useEffect } from "react";
import { DatabaseName, db } from "@/modules/core/services/database/DatabaseManager";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { toast } from "../../components/ui/UseToast";

export const deleteDatabase = async (
    options: {
        reloadPage: boolean;
    } = { reloadPage: false }
) => {
    try {
        await db.delete();
        localStorage.removeItem("core");
        localStorage.removeItem("database");

        options.reloadPage && location.reload();
        return true;
    } catch (error) {
        toast({
            title: "Daten konnten nicht gelöscht werden!",
            description: "Laden Sie die Anwendung erneut und versuchen Sie es noch einmal",
            duration: 10000,
            variant: "destructive",
        });
        console.log(error);
        return false;
    }
};

export const useDatabaseDeletion = () => {
    const deleteIndexedDbOnExit = useDataManagementStore((state) => state.deleteIndexedDbOnExit);
    const indexedDbExpiresAt = useDataManagementStore((state) => state.indexedDbExpiresAt);
    const gentrainDbIsSelected = (db.name as DatabaseName) === "gentrain";

    useEffect(() => {
        if (!deleteIndexedDbOnExit || !gentrainDbIsSelected) return;

        let shouldDelete = false;

        // mark the user is about to leave and give him the chance to cancel
        const handleBeforeUnload = (ev: BeforeUnloadEvent) => {
            ev.preventDefault();
            ev.returnValue = "";
            shouldDelete = true;
        };

        // if the user really leaves, delete the database
        const handleUnload = () => {
            if (shouldDelete) {
                void deleteDatabase();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("unload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("unload", handleUnload);
        };
    }, [deleteIndexedDbOnExit, gentrainDbIsSelected, deleteDatabase]);

    useEffect(() => {
        if (!indexedDbExpiresAt || !gentrainDbIsSelected) return;
        let warningShown = false;

        const checkExpiration = async () => {
            const timeLeft = indexedDbExpiresAt - Date.now();
            const timeLeftInHours = Math.round(timeLeft / (1000 * 60 * 60));

            if (timeLeft <= 0) {
                const success = await deleteDatabase({ reloadPage: true });
                if (success) {
                    toast({
                        title: "Daten wurden gelöscht!",
                        description:
                            "Die Datenbank wurde automatisch gelöscht, da die festgelegte Lebensdauer (TTL) abgelaufen ist.",
                        duration: 10000,
                        variant: "success",
                    });
                }
            } else if (timeLeftInHours < 6 && !warningShown) {
                warningShown = true;
                toast({
                    title: `Achtung, Ihre Daten laufen in ca. ${timeLeftInHours} Stunden ab und werden anschließend automatisch gelöscht!`,
                    description:
                        "Wenn Sie das verhindern möchten, deaktivieren Sie die zeitlich begrenzte Datenspeicherung oder setzen Sie die Frist zurück.",
                    duration: 15000,
                    className: "bg-primary text-white",
                });
            }
        };

        // check expiration immediately on effect run
        void checkExpiration();

        // check every 1 minute
        const timer = 60 * 1000;
        const interval = setInterval(checkExpiration, timer);

        return () => clearInterval(interval);
    }, [indexedDbExpiresAt, gentrainDbIsSelected, deleteDatabase]);
};
