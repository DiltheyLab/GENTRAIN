import { Layout } from "@/components/layout/Layout";
import { DataTable } from "@/components/tables/sequenceData/data-table";
import { columns } from "@/components/tables/sequenceData/columns";

import { Separator } from "@/components/ui/separator";
import { useGetAllSamples } from "@/hooks/database/samples/useGetAllSamples";
import { UploadSection } from "@/components/dataUpload/UploadSection";

export function DataUpload() {
    const samplesData = useGetAllSamples();
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
                            <h2 className="text-2xl font-bold tracking-tight">Sequenzdaten</h2>
                            <p className="text-muted-foreground">Hier ist eine Liste der hochgeladenen Sequenzdaten.</p>
                        </div>
                    </div>
                    {samplesData && <DataTable data={samplesData} columns={columns} />}
                </div>
            </div>
        </Layout>
    );
}
