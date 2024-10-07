import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { ContactUpload } from "../services/data_upload/validation/ContactsValidation";

export const useGetContactUploads = () => {
    const contactUploads = useDataManagementStore((state) => state.contactUploads);
    const [uploads, setUploads] = useState<{ [contactId: string]: ContactUpload } | null>(null);

    useEffect(() => {
        setUploads(Object.keys(contactUploads).length > 0 ? contactUploads : null);
    }, [contactUploads]);

    return uploads;
};
