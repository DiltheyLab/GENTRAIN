import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { ContactImport } from "@/modules/core/models/contacts";

export const useGetContactImports = () => {
    const contactImports = useDataManagementStore((state) => state.contactImports);
    const [imports, setImports] = useState<{ [contactId: string]: ContactImport } | null>(null);

    useEffect(() => {
        setImports(Object.keys(contactImports).length > 0 ? contactImports : null);
    }, [contactImports]);

    return imports;
};
