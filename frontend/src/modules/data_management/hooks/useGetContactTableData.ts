import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { ContactImport } from "@/modules/core/models/contacts";

export const useGetContactTableData = () => {
    const contactUploads = useDataManagementStore((state) => state.contactUploads);
    const [tableData, setTableData] = useState<ContactImport[]>([]);

    useEffect(() => {
        const contacts: ContactImport[] = [];

        for (const contactId of Object.keys(contactUploads)) {
            const contact = contactUploads[contactId];
            contact.contact_id = contactId;
            contacts.push(contact);
        }
        setTableData(contacts);
    }, [contactUploads]);

    return tableData;
};
