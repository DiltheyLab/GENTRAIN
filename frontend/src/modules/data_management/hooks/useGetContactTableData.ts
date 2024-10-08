import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { ContactImport } from "@/modules/core/models/contacts";

export const useGetContactTableData = () => {
    const contactImports = useDataManagementStore((state) => state.contactImports);
    const [tableData, setTableData] = useState<ContactImport[]>([]);

    useEffect(() => {
        const contacts: ContactImport[] = [];

        for (const contactId of Object.keys(contactImports)) {
            const contact = contactImports[contactId];
            contact.contact_id = contactId;
            contacts.push(contact);
        }
        setTableData(contacts);
    }, [contactImports]);

    return tableData;
};
