import { Layout } from "@/components/layout/Layout";
import { DataTable } from "@/components/tables/cases/data-table";
import { columns } from "@/components/tables/cases/columns";

import { Separator } from "@/components/ui/separator";
import { UploadSection } from "@/components/dataUpload/UploadSection";
import { useGetAllCases } from "@/hooks/database/cases/useGetAllCases";
import { PathogenDialog } from "@/components/dataUpload/PathogenDialog";

export function DataUpload() {
    const casesData = useGetAllCases();
    return (
        <Layout>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="space-y-8">
                    <div className="flex items-center justify-between space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Eigene Sequenzdaten importieren:</h2>
                            <p className="text-muted-foreground">
                                Wählen Sie eine Datei im FASTA-Format, die die zu importierenden viralen Sequenzdaten
                                enthält. Die Daten werden überprüft und in den Datensatz eingebaut. Nach dem Upload
                                können Sie Metadaten zu den Sequenzen hinzufügen.
                            </p>
                        </div>
                    </div>

                    <UploadSection />
                </div>
                <Separator />
                <div className="space-y-8">
                    <div className="flex items-center justify-between space-y-2 ">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Falldaten</h2>
                            <p className="text-muted-foreground">Hier ist eine Liste der hochgeladenen Falldaten.</p>
                        </div>
                    </div>
                    {casesData && <DataTable data={casesData} columns={columns} />}
                </div>
            </div>
            <PathogenDialog />
        </Layout>
    );
}
