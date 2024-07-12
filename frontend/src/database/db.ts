import Dexie, { type EntityTable } from "dexie";
import { exportDB, importInto } from "dexie-export-import";
import type { SampleSchema } from "@/database/samples";
import type { DistanceMatrixSchema } from "@/database/distance_matrix";
import { downloadFile } from "@/services/files";
import { DistanceMatricesSchema } from "./distance_matrices";
import { DistancesSchema } from "./distances";
import { CaseSchema } from "./cases";
import { ContactSchema } from "./contacts";
import { GroupSchema } from "./groups";
import { Pathogens, PathogenSchema } from "./pathogens";
import { PathogenTypeName, PathogenTypeSchema } from "./pathogen_types";

const db = new Dexie("gentrain") as Dexie & {
    samples: EntityTable<SampleSchema, "id">;
    distance_matrix: EntityTable<DistanceMatrixSchema, "id">;
    distance_matrices: EntityTable<DistanceMatricesSchema, "id">;
    distances: EntityTable<DistancesSchema, "id">;
    cases: EntityTable<CaseSchema, "id">;
    contacts: EntityTable<ContactSchema, "id">;
    groups: EntityTable<GroupSchema, "id">;
    pathogens: EntityTable<PathogenSchema, "id">;
    pathogen_types: EntityTable<PathogenTypeSchema, "id">;
};

// define the database tables (https://dexie.org/)
// first column is primary key
// ++id is autoincrementing
// *column_name = MultiEntry
db.version(1).stores({
    samples:
        "++id, fasta_id, case_id, ims_id, group, sequence, n_count, location_sending_lab, location_sequencing_lab, lineage, variants, metadata, sampled_at, updated_at",
    distance_matrix: "id, name, row_column_names, matrix, pathogen_id, updated_at", //to be removed in future versions
    distance_matrices: "++id, pathogen_id, name, updated_at",
    distances: "++id, sample_id_1, sample_id_2, distance_matrix_id, value",
    cases: "++id, case_id, sample_id, *groups, pathogen_id, date, updated_at",
    contacts: "++id, case_id_1, case_id_2, type, context, updated_at",
    groups: "++id, name, updated_at",
    pathogens: "++id, name, pathogen_type_id, activated_at, updated_at",
    pathogen_types: "++id, name, updated_at",
});

db.on("populate", async () => {
    let persistedPathogenTypes = {} as Record<string, number>;
    for (const [pathogenName, pathogenType] of Object.entries(Pathogens)) {
        // retrieve pathogen type name from enum
        const pathogenTypeName = PathogenTypeName[pathogenType];
        // check if the type of the pathogen (bacteria or virus) already exists in pathogen_types-table
        // otherwise persist pathogen_type
        if ((await db.pathogen_types.where({ name: pathogenTypeName }).count()) === 0) {
            const newPathogenTypeId = await db.pathogen_types.add({
                name: pathogenTypeName as unknown as PathogenTypeName,
                updated_at: Date.now().toString(),
            });
            persistedPathogenTypes[pathogenTypeName] = newPathogenTypeId;
        }
        // check if the pathogen already exists in pathogen-table
        // otherwise persist pathogen
        if ((await db.pathogens.where({ name: pathogenName }).count()) === 0) {
            db.pathogens.add({
                name: pathogenName,
                pathogen_type_id: persistedPathogenTypes[pathogenTypeName],
                updated_at: Date.now().toString(),
            });
        }
    }
});

const importDataFromJson = async (file: Blob) => {
    db.tables.forEach((table) => {
        table.clear();
    });
    await importInto(db, file);
};

const exportDatabaseToJson = async () => {
    const blob = await exportDB(db);
    downloadFile(blob, `gentrain_export_${new Date().toLocaleString()}.json`);
};

export { db, importDataFromJson, exportDatabaseToJson };
