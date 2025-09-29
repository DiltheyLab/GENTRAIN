import { useEffect } from "react";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { toast } from "../../components/ui/UseToast";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export const deleteDatabase = async () => {
    try {
        await db.delete();
        localStorage.removeItem("core");
        localStorage.removeItem("selectedDB");
        localStorage.removeItem("deleteOnStartup");
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

export const useDatabaseDeletion = () => {
    const indexedDBDeletionOnExitIsActive = useDataManagementStore((state) => state.indexedDBDeletionOnExitIsActive);

    useEffect(() => {
        return;
        if (!indexedDBDeletionOnExitIsActive) return;

        const handleBeforeUnload = () => {
            const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
            const navType = navEntries.length > 0 ? navEntries[0].type : "navigate";
            if (navType !== "reload") {
                // Mark deletion as pending in case the browser closes before the async
                // operation completes. Some browsers do not wait for IndexedDB deletions
                // to finish on unload, so we ensure cleanup will run on the next startup.
                //localStorage.setItem("deleteOnStartup", "true");
                deleteDatabase();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [indexedDBDeletionOnExitIsActive]);
};
