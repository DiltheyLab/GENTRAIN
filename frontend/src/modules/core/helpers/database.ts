import { exportDB, importInto } from "dexie-export-import";
import { db } from "@/modules/core/infrastructure/database";
import { downloadFile } from "@/modules/core/helpers/files";
import { useCoreStore } from "../stores/core";

export const importDataFromJson = async (file: Blob) => {
    db.tables.forEach((table) => {
        table.clear();
    });
    await importInto(db, file);
    useCoreStore.getState().updateCasesWithRelationships();
};

export const exportDatabaseToJson = async () => {
    const blob = await exportDB(db);
    downloadFile(blob, `gentrain_export_${new Date().toISOString()}.json`);
};
