import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Separator } from "@/modules/core/components/ui/Separator";
import { Button } from "@/modules/core/components/ui/Button";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { deleteDataForPathogen } from "@/modules/core/models/pathogens";
import { useCoreStore } from "@/modules/core/stores/core";
import { Layout } from "@/modules/core/components/layout/Layout";
import { uploadedCaseColumns } from "@/modules/data_management/components/imported_data/uploadedCaseColumns";
import { uploadedDataFilterFn } from "@/modules/data_management/helpers/dataTable";
import { uploadedOutbreakColumns } from "../components/imported_data/uploadedOutbreakColumns";
import { useGetOutbreaksWithCaseCountForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksWithCaseCountForActivePathogen";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { useGetCategoriesWithGroupsAndCaseCountForActivePathogen } from "@/modules/core/hooks/database/categories/useGetCategoriesWithCaseCountForActivePathogen";
import { uploadedGroupColumns } from "../components/imported_data/uploadedGroupColumns";
import { useDataManagementStore } from "../stores/dataManagement";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/modules/core/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { InitialUploadDialog } from "../components/import_section/InitialUploadDialog";
import { ImportSection } from "../components/import_section/ImportSection";

export function DataManagement() {
    const { activePathogen, updateCasesWithRelationships } = useCoreStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const casesData = useCoreStore((state) => state.casesWithRelationships);
    const casesForPathogen = useGetAllCasesForActivePathogenWithRelationships();
    const outbreakData = useGetOutbreaksWithCaseCountForActivePathogen();
    const groupData = useGetCategoriesWithGroupsAndCaseCountForActivePathogen();

    const showInitialUpload = useDataManagementStore((state) => state.showInitialUpload);
    const setShowInitialUpload = useDataManagementStore((state) => state.setShowInitialUpload);

    useEffect(() => {
        if (
            !showInitialUpload &&
            !activePathogen?.pathogen_type?.initialized_at &&
            casesForPathogen &&
            casesForPathogen.length === 0
        ) {
            setShowInitialUpload(true);
        }
    }, [casesForPathogen]);

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
                {showInitialUpload && (
                    <div className="space-y-8">
                        <InitialUploadDialog />
                    </div>
                )}
                {!showInitialUpload && (
                    <>
                        <div className="space-y-8 w-full">
                            <ImportSection />
                        </div>
                        {casesData && casesData.length > 0 && <Separator />}
                    </>
                )}
                {casesData && casesData.length > 0 && (
                    <>
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            Importierte Daten zu {activePathogen?.name}
                                        </h2>
                                    </div>
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
                                                        <>Alle Daten zu {activePathogen.name} löschen</>
                                                    )}
                                                </Button>
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold tracking-tight mb-2 text-lg">Falldaten</h3>
                                </div>
                            </div>
                            {casesData && (
                                <DataTable
                                    data={casesData}
                                    columns={uploadedCaseColumns}
                                    filterFn={uploadedDataFilterFn}
                                    selectionLabel="Fällen"
                                    pageSize={5}
                                />
                            )}
                        </div>
                        {((outbreakData && outbreakData.length > 0) || (groupData && groupData.length > 0)) && (
                            <>
                                <Accordion type="multiple">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="py-2">
                                            <h3 className="font-bold tracking-tight text-lg">Ausbrüche</h3>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <DataTable
                                                data={outbreakData ?? []}
                                                enableSearch={false}
                                                columns={uploadedOutbreakColumns}
                                                selectionLabel="Ausbrüchen"
                                                pageSize={5}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <Accordion type="multiple">
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="py-2">
                                            <h3 className="font-bold tracking-tight text-lg">Gruppen</h3>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {groupData?.map((category) => (
                                                <div
                                                    key={category.id}
                                                    className="px-4 pt-4 bg-muted/50 rounded-lg mb-4"
                                                >
                                                    <p className="text-md">
                                                        <span className="font-medium">Kategorie:</span> {category.name}
                                                    </p>
                                                    <DataTable
                                                        className="mt-1"
                                                        data={category.groups ?? []}
                                                        enableSearch={false}
                                                        columns={uploadedGroupColumns}
                                                        selectionLabel="Gruppen"
                                                        pageSize={5}
                                                    />
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}
