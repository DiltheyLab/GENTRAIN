import { db } from "@/modules/core/services/database/DatabaseManager";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllContacts = () => {
    return useLiveQuery(() => db.contacts.toArray());
};
