import { useDataManagementStore } from "../stores/dataManagement";
import { ImportSection } from "../components/import_section/ImportSection";
import { ImportAssistent } from "../components/import_assistent/ImportAssistent";
import { DatabaseDeletion } from "../components/DatabaseDeletion";
import { DataOverview } from "../components/DataOverview";

export function DataManagement() {
    const showImportAssistent = useDataManagementStore((state) => state.showImportAssistent);

    return (
        <div className="flex flex-1 flex-col space-y-3 p-5">
            {showImportAssistent && <ImportAssistent />}
            <ImportSection />
            <DataOverview />
            <DatabaseDeletion />
        </div>
    );
}
