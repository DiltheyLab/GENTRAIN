import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Separator } from "@/modules/core/components/ui/Separator";
import { Button } from "@/modules/core/components/ui/Button";
import { useState } from "react";
import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { deleteDataForPathogen } from "@/modules/core/models/pathogens";
import { UploadSection } from "../components/upload_section/UploadSection";
import { useCoreStore } from "@/modules/core/stores/core";
import { Layout } from "@/modules/core/components/layout/Layout";
import { uploadedCaseColumns } from "@/modules/data_management/components/uploaded_data/uploadedCaseColumns";
import { uploadedDataFilterFn } from "@/modules/data_management/helpers/dataTable";
import { uploadedOutbreakColumns } from "../components/uploaded_data/uploadedOutbreakColumns";
import { useGetOutbreaksWithCaseCountForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksWithCaseCountForActivePathogen";

export function DataManagement() {
    const { activePathogen, updateCasesWithRelationships } = useCoreStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const casesData = useCoreStore((state) => state.casesWithRelationships);
    const outbreakData = useGetOutbreaksWithCaseCountForActivePathogen();

    const deleteData = async () => {
        if (activePathogen) {
            setIsDeleting(true);
            await deleteDataForPathogen(activePathogen.id);
            await updateCasesWithRelationships();
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
                <div className="space-y-4">
                    <div className="flex items-center justify-between space-y-2 ">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Falldaten für {activePathogen?.name}</h2>
                        </div>
                    </div>

                    {casesData && (
                        <DataTable data={casesData} columns={uploadedCaseColumns} filterFn={uploadedDataFilterFn} />
                    )}
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="flex items-center justify-between space-y-2 ">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Ausbrüche für {activePathogen?.name}</h2>
                        </div>
                    </div>
                    {outbreakData && <DataTable data={outbreakData ?? []} columns={uploadedOutbreakColumns} />}
                </div>
                <div className="flex justify-end">
                    {casesData && activePathogen && (
                        <DeleteDialog
                            deleteAction={deleteData}
                            dialogTitle="Falldaten löschen"
                            dialogDescription={`Möchten sie die Falldaten zu ${activePathogen.name} wirklich löschen?`}
                            triggerComponent={
                                <Button variant="destructive">
                                    {isDeleting ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>Ausbruchsdaten zu {activePathogen.name} löschen</>
                                    )}
                                </Button>
                            }
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
}
