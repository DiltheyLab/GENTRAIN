import { useEffect, useRef } from "react";
import { DatabaseName, db } from "@/modules/core/services/database/DatabaseManager";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { toast } from "../../components/ui/UseToast";

export const deleteDatabase = async (options: { reloadPage?: boolean; unregisterHandlers?: () => void } = {}) => {
    try {
        await db.delete();
        localStorage.removeItem("core");
        localStorage.removeItem("database");

        if (options.reloadPage) {
            options.unregisterHandlers?.(); // prevent triggering unload handlers after deletion because page is reloading
            location.reload(); // reload the page to reset the app state
        }

        return true;
    } catch (error) {
        toast({
            title: "Daten konnten nicht gelöscht werden!",
            description: "Laden Sie die Anwendung erneut und versuchen Sie es noch einmal",
            duration: 10000,
            variant: "destructive",
        });
        console.error(error);
        return false;
    }
};

export const useDatabaseDeletion = () => {
    const deleteIndexedDbOnExit = useDataManagementStore((store) => store.deleteIndexedDbOnExit);
    const indexedDbExpiresAt = useDataManagementStore((store) => store.indexedDbExpiresAt);
    const indexedDbTtlIsEnabled = useDataManagementStore((store) => store.indexedDbTtlIsEnabled);
    const gentrainDbIsSelected = (db.name as DatabaseName) === "gentrain";

    // Ref saves current handlers for unregistering
    const handlersRef = useRef<{
        handleBeforeUnload?: (ev: BeforeUnloadEvent) => void;
        handleUnload?: () => void;
    }>({});

    const unregisterHandlers = () => {
        if (handlersRef.current.handleBeforeUnload) {
            window.removeEventListener("beforeunload", handlersRef.current.handleBeforeUnload);
            handlersRef.current.handleBeforeUnload = undefined;
        }
        if (handlersRef.current.handleUnload) {
            window.removeEventListener("unload", handlersRef.current.handleUnload);
            handlersRef.current.handleUnload = undefined;
        }
    };

    // Exit-based deletion
    useEffect(() => {
        if (!deleteIndexedDbOnExit || !gentrainDbIsSelected) return;

        let shouldDelete = false;

        const handleBeforeUnload = (ev: BeforeUnloadEvent) => {
            ev.preventDefault();
            ev.returnValue = "";
            shouldDelete = true;
        };

        const handleUnload = () => {
            if (shouldDelete) {
                void deleteDatabase();
            }
        };

        handlersRef.current.handleBeforeUnload = handleBeforeUnload;
        handlersRef.current.handleUnload = handleUnload;

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("unload", handleUnload);

        //clean-up
        return unregisterHandlers;
    }, [deleteIndexedDbOnExit, gentrainDbIsSelected, unregisterHandlers]);

    // TTL-based deletion
    useEffect(() => {
        if (!indexedDbTtlIsEnabled || !indexedDbExpiresAt || !gentrainDbIsSelected) return;
        let warningShown = false;

        const checkExpiration = async () => {
            const timeLeft = indexedDbExpiresAt - Date.now();
            const timeLeftInHours = Math.round(timeLeft / (1000 * 60 * 60));

            if (timeLeft <= 0) {
                const success = await deleteDatabase({
                    reloadPage: true,
                    unregisterHandlers: unregisterHandlers,
                });
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

        void checkExpiration();
        const interval = setInterval(checkExpiration, 60 * 1000); // check every minute

        return () => clearInterval(interval);
    }, [indexedDbExpiresAt, gentrainDbIsSelected, indexedDbTtlIsEnabled]);
};
