import { Layout } from "@/components/layout/Layout";
import { UploadDataTable } from "@/components/tables/UploadDataTable";

import { Separator } from "@/components/ui/separator";
import { UploadSection } from "@/components/dataUpload/UploadSection";
import { useGetAllCasesWithRelationships } from "@/hooks/database/cases/useGetAllCasesWithRelationships";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app";
import { deleteDataForPathogen } from "@/database/db";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { DeleteDialog } from "@/components/ui/deleteDialog";

export function DataUpload() {
    const casesData = useGetAllCasesWithRelationships();
    const { activePathogen } = useAppStore();
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteData = async () => {
        if (activePathogen) {
            setIsDeleting(true);
            await deleteDataForPathogen(activePathogen.id);
            setIsDeleting(false);
        }
    };

    return (
        <Layout>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="space-y-8">
                    <div className="flex items-center justify-between space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Ausbruchsdaten importieren:</h2>
                            <p className="text-muted-foreground">
                                Laden Sie hier ihre Ausbruchsdaten für {activePathogen?.name} hoch. Zu jedem
                                hochgeladenen Fall können Sequenz- sowie Kontaktdaten hinterlegt werden.
                            </p>
                        </div>
                    </div>

                    <UploadSection />
                </div>
                <Separator />
                <div className="space-y-8">
                    <div className="flex items-center justify-between space-y-2 ">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                Ausbruchsdaten für {activePathogen?.name}
                            </h2>
                        </div>
                    </div>
                    {casesData && <UploadDataTable data={casesData} />}

                    <div className="flex justify-end">
                        {casesData && activePathogen && (
                            <DeleteDialog
                                deleteAction={deleteData}
                                dialogTitle="Falldaten löschen"
                                dialogDescription={`Möchten sie die Falldaten zu ${activePathogen.name} wirklich löschen?`}
                                triggerComponent={
                                    <Button variant="destructive">
                                        {isDeleting && <LoadingSpinner></LoadingSpinner>}
                                        {!isDeleting && <>Ausbruchsdaten zu {activePathogen.name} löschen</>}
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
