import { db } from "@/modules/core/infrastructure/database";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllContacts = () => {
    return useLiveQuery(() => db.contacts.toArray());
};
