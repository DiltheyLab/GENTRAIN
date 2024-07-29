import { Layout } from "@/components/layout/Layout";
import { UploadDataTable } from "@/components/tables/UploadDataTable";

import { Separator } from "@/components/ui/separator";
import { UploadSection } from "@/components/dataUpload/UploadSection";
import { useGetAllCasesWithRelationships } from "@/hooks/database/cases/useGetAllCasesWithRelationships";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app";
import { deleteDataForPathogen } from "@/database/db";

export function DataUpload() {
    const casesData = useGetAllCasesWithRelationships();
    const { activePathogen } = useAppStore();

    return (
        <Layout>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="space-y-8">
                    <div className="flex items-center justify-between space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Analysedaten importieren:</h2>
                            <p className="text-muted-foreground">
                                Laden Sie hier ihre Analysedaten hoch. Zu hochgeladenen Fällen können Sequenz- als auch
                                Kontaktdaten hinterlegt werden.
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
                    {casesData && <UploadDataTable data={casesData} />}

                    <div className="flex justify-end">
                        {casesData && activePathogen && (
                            <Button variant="destructive" onClick={() => deleteDataForPathogen(activePathogen.id)}>
                                Falldaten zu {activePathogen.name} löschen
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
