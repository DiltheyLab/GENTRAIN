import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllContacts = () => {
    return useLiveQuery(() => db.contacts.toArray());
};
