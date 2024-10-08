import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { ContactImport } from "@/modules/core/models/contacts";

export const useGetContactUploads = () => {
    const contactUploads = useDataManagementStore((state) => state.contactUploads);
    const [uploads, setUploads] = useState<{ [contactId: string]: ContactImport } | null>(null);

    useEffect(() => {
        setUploads(Object.keys(contactUploads).length > 0 ? contactUploads : null);
    }, [contactUploads]);

    return uploads;
};
