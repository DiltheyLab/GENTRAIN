import { db } from "@/core/infrastructure/database";
import { SampleSchema } from "@/modules/core/models/samples";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllSamples = (): SampleSchema[] | undefined => {
    return useLiveQuery(() => db.samples.toArray());
};
