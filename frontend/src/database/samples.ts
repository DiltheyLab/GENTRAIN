import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

interface SampleSchema {
    id: number;
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

export const useSamplesGetAll = (): SampleSchema[] | undefined => {
    return useLiveQuery(() => db.samples.toArray());
};

export const getAllSamples = (): Promise<SampleSchema[] | undefined> => {
    return db.samples.toArray();
};

export type { SampleSchema };
