import Dexie, { type EntityTable } from "dexie";
import { importInto } from "dexie-export-import";

interface Sample {
    fasta_id: string;
    ims_id: string;
    group: string;
    sequence: string;
    n_count: number;
    location_sending_lab: string;
    location_sequencing_lab: string;
    lineage: string;
    variants: object;
    metadata: string;
    sampled_at: string;
    updated_at: string;
}

interface DistanceMatrix {
    id: string;
    row_column_names: Array<string>;
    matrix: Array<Array<number>>;
    updated_at: string;
}

const db = new Dexie("gentrain") as Dexie & {
    samples: EntityTable<Sample, "fasta_id">;
    distance_matrix: EntityTable<DistanceMatrix, "id">;
};

db.version(1).stores({
    samples:
        "fasta_id, ims_id, group, sequence, n_count, location_sending_lab, location_sequencing_lab, lineage, variants, metadata, sampled_at, updated_at",
    distance_matrix: "id, row_column_names, matrix, updated_at",
});

const importDataFromFile = async (file: Blob) => {
    db.delete({ disableAutoOpen: false });
    await importInto(db, file);
};

const getDistanceMatrix = async (): Promise<DistanceMatrix | undefined> => {
    return await db.distance_matrix.get("dm_full");
};

export type { Sample, DistanceMatrix };
export { db, importDataFromFile, getDistanceMatrix };
