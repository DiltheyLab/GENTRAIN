import { DataTable } from "@/modules/core/components/tables/DataTable";
import { outbreakTableColumns } from "./outbreakTableColumns";
import { useGetOutbreaksWithCaseCountForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksWithCaseCountForActivePathogen";
import { CreateOutbreakDialog } from "./CreateOutbreakDialog";
import { Row } from "@tanstack/react-table";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { AssignCasesToOutbreakDialog } from "./AssignCasesToOutbreakDialog";

export const OutbreakSection = () => {
    const outbreakData = useGetOutbreaksWithCaseCountForActivePathogen();
    if (!outbreakData) return null;

    return (
        <div className="p-3 rounded-lg bg-white" data-tutorial-tour-step="data-management-outbreak-section">
            <h2 className="text-2xl font-bold tracking-tight">Ausbrüche</h2>
            <p className="text-muted-foreground">Hier können Sie alle Ihre Ausbrüche einsehen und neue anlegen.</p>
            <DataTable
                data={outbreakData ?? []}
                columns={outbreakTableColumns}
                selectionLabel="Ausbrüchen"
                pageSize={5}
                actions={(_table) => (
                    <div className="flex space-x-3">
                        {/*                         <AssignCasesToOutbreakDialog />
                         */}{" "}
                        <CreateOutbreakDialog />
                    </div>
                )}
                className="mt-3"
                filterFn={(row: Row<OutbreakSchema>, _columnId: any, value: string) =>
                    row.original.name.toLowerCase().includes(value.toLowerCase())
                }
                filterPlaceholder="Ausbrüche suchen..."
            />
        </div>
    );
};
