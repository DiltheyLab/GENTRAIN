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
import { PathogenSchema } from "./pathogens";

const db = new Dexie("gentrain") as Dexie & {
    samples: EntityTable<SampleSchema, "fasta_id">;
    distance_matrix: EntityTable<DistanceMatrixSchema, "id">;
    distance_matrices: EntityTable<DistanceMatricesSchema, "id">;
    distances: EntityTable<DistancesSchema, "id">;
    cases: EntityTable<CaseSchema, "id">;
    contacts: EntityTable<ContactSchema, "id">;
    groups: EntityTable<GroupSchema, "id">;
    pathogens: EntityTable<PathogenSchema, "id">;
};

// define the database tables (https://dexie.org/)
// first column is primary key
// ++id is autoincrementing
// *column_name = MultiEntry
db.version(1).stores({
    samples:
        "fasta_id, case_id, ims_id, group, sequence, n_count, location_sending_lab, location_sequencing_lab, lineage, variants, metadata, sampled_at, updated_at",
    distance_matrix: "++id, name, row_column_names, matrix, updated_at", //to be removed in future versions
    distance_matrices: "++id, pathogen_id, name, updated_at",
    distances: "++id, *samples, distance_matrix_id, value",
    cases: "id, fasta_id, *groups, pathogen_id, date, updated_at",
    contacts: "++id, case_id_1, case_id_2, type, context, updated_at",
    groups: "++id, name, updated_at",
    pathogens: "++id, name, updated_at",
});

const importDataFromJson = async (file: Blob) => {
    db.delete({ disableAutoOpen: false });
    await importInto(db, file);
};

const exportDatabaseToJson = async () => {
    const blob = await exportDB(db);
    downloadFile(blob, `gentrain_export_${new Date().toLocaleString()}.json`);
};

export { db, importDataFromJson, exportDatabaseToJson };
