import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { uploadedGroupColumns } from "./uploadedGroupColumns";
import { useGetCategoriesWithGroupsAndCaseCountForActivePathogen } from "@/modules/core/hooks/database/categories/useGetCategoriesWithCaseCountForActivePathogen";

export const GroupSection = () => {
    const groupData = useGetCategoriesWithGroupsAndCaseCountForActivePathogen();
    if (!groupData) return null;

    return (
        <Accordion type="multiple">
            <AccordionItem value="item-2">
                <AccordionTrigger className="py-2">
                    <h3 className="font-bold tracking-tight text-lg">Gruppen</h3>
                </AccordionTrigger>
                <AccordionContent>
                    {groupData?.map((category) => (
                        <div key={category.id} className="px-4 pt-4 bg-muted/50 rounded-lg mb-4">
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
    );
};
