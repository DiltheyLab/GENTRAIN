import { db } from "@/modules/core/infrastructure/database";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetSequenceIdentifierCount = (): number => {
    return useLiveQuery(() => db.sequence_identifiers.count()) ?? 0;
};
