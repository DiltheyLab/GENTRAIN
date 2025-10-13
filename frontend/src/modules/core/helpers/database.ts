import { importInto } from "dexie-export-import";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { useCoreStore } from "../stores/core";
import { PathogenSchema } from "../models/pathogens";

export const importDataFromJson = async (file: Blob) => {
    db.tables.forEach((table) => {
        table.clear();
    });
    await importInto(db, file);
    useCoreStore.getState().updateCasesWithRelationships();
    const pathogens = await db.pathogens.toArray();
    const activePathogen = pathogens.filter((pathogen: PathogenSchema) => pathogen.activated_at)[0];
    useCoreStore.getState().updateActivePathogen(activePathogen);
};
