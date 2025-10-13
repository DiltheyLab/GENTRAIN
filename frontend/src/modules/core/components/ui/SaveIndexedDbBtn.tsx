import { Save } from "lucide-react";
import { Button } from "@/modules/core/components/ui/Button";
import { exportDB } from "dexie-export-import";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { downloadFile } from "@/modules/core/helpers/files";

export const SaveIndexedDbBtn = () => {
    const exportDatabaseToJson = async () => {
        const blob = await exportDB(db);
        downloadFile(blob, `gentrain_export_${new Date().toISOString()}.json`);
    };

    return (
        <Button
            variant="outline"
            className="gap-2 flex items-center"
            onClick={() => exportDatabaseToJson()}
            title="Zustand speichern"
        >
            <span className="hidden md:inline">Zustand speichern</span>
            <Save className="h-5 w-5" />
        </Button>
    );
};
