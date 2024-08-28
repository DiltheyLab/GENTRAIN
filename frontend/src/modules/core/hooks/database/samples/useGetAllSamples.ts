import { db } from "@/database/db";
import { SampleSchema } from "@/database/samples";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllSamples = (): SampleSchema[] | undefined => {
    return useLiveQuery(() => db.samples.toArray());
};
