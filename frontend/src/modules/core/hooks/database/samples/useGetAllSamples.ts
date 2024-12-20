import { db } from "@/modules/core/services/database/DatabaseManager";
import { SampleSchema } from "@/modules/core/models/samples";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllSamples = (): SampleSchema[] | undefined => {
    return useLiveQuery(() => db.samples.toArray());
};
