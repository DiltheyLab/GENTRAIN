import Dexie, { type EntityTable } from "dexie";
import { exportDB, importInto } from "dexie-export-import";
import type { SampleSchema } from "@/database/samples";
import type { DistanceMatrixSchema } from "@/database/distance_matrix";
import { downloadFile } from "@/services/files";

const db = new Dexie("gentrain") as Dexie & {
    samples: EntityTable<SampleSchema, "fasta_id">;
    distance_matrix: EntityTable<DistanceMatrixSchema, "id">;
};

db.version(1).stores({
    samples:
        "fasta_id, ims_id, group, sequence, n_count, location_sending_lab, location_sequencing_lab, lineage, variants, metadata, sampled_at, updated_at",
    distance_matrix: "id, row_column_names, matrix, updated_at",
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
