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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { useGetCategoriesWithGroupsAndCaseCountForActivePathogen } from "@/modules/core/hooks/database/categories/useGetCategoriesWithCaseCountForActivePathogen";
import { uploadedGroupColumns } from "../components/uploaded_data/uploadedGroupColumns";
export function DataManagement() {
    const { activePathogen, updateCasesWithRelationships } = useCoreStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const casesData = useCoreStore((state) => state.casesWithRelationships);
    const outbreakData = useGetOutbreaksWithCaseCountForActivePathogen();
    const groupData = useGetCategoriesWithGroupsAndCaseCountForActivePathogen();

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
                            <h2 className="text-2xl font-bold tracking-tight">Daten importieren</h2>
                            <p className="text-muted-foreground">
                                Laden Sie hier Falldaten zu {activePathogen?.name} hoch. Zu jedem hochgeladenen Fall
                                können Sequenz- sowie Kontaktdaten hinterlegt werden.
                            </p>
                        </div>
                    </div>

                    <UploadSection />
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="flex items-center justify-between space-y-2 ">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                Importierte Daten zu {activePathogen?.name}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold tracking-tight">Fälle, Sequenzen und Kontakte</h3>
                        </div>
                    </div>
                    {casesData && (
                        <DataTable data={casesData} columns={uploadedCaseColumns} filterFn={uploadedDataFilterFn} />
                    )}
                </div>
                <Accordion type="multiple">
                    {outbreakData && (
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="py-2">
                                <h3 className="font-bold tracking-tight">Ausbrüche</h3>
                            </AccordionTrigger>
                            <AccordionContent>
                                <DataTable
                                    data={outbreakData ?? []}
                                    enableSearch={false}
                                    columns={uploadedOutbreakColumns}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {groupData && (
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="py-2">
                                <h3 className="font-bold tracking-tight">Gruppen</h3>
                            </AccordionTrigger>
                            <AccordionContent>
                                {groupData?.map((category) => {
                                    return (
                                        <div key={category.id} className="px-4 pt-4 bg-muted/50 rounded-lg mb-4">
                                            <p className="text-md">
                                                <span className="font-medium">Kategorie:</span> {category.name}
                                            </p>
                                            <DataTable
                                                className="mt-1"
                                                data={category.groups ?? []}
                                                enableSearch={false}
                                                columns={uploadedGroupColumns}
                                            />
                                        </div>
                                    );
                                })}
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
                <div className="flex justify-end">
                    {casesData && activePathogen && (
                        <DeleteDialog
                            deleteAction={deleteData}
                            dialogTitle="Falldaten löschen"
                            dialogDescription={`Möchten sie die Falldaten zu ${activePathogen.name} wirklich löschen?`}
                            triggerComponent={
                                <Button variant="destructive">
                                    {isDeleting ? <LoadingSpinner /> : <>Alle Daten zu {activePathogen.name} löschen</>}
                                </Button>
                            }
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
}
