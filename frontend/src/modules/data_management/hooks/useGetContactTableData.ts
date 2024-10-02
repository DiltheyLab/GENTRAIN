import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { ContactUpload } from "../services/data_upload/validation/ContactsValidation";

export const useGetContactTableData = () => {
    const contactUploads = useDataManagementStore((state) => state.contactUploads);
    const [tableData, setTableData] = useState<ContactUpload[]>([]);

    useEffect(() => {
        const contacts: ContactUpload[] = [];

        for (const contactId of Object.keys(contactUploads)) {
            const contact = contactUploads[contactId];
            contact.contact_id = contactId;
            contacts.push(contact);
        }
        setTableData(contacts);
    }, [contactUploads]);

    return tableData;
};
