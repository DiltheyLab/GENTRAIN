import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { groupTableColumns } from "./groupTableColumns";
import { useGetCategoriesWithGroupsAndCaseCountForActivePathogen } from "@/modules/core/hooks/database/categories/useGetCategoriesWithCaseCountForActivePathogen";

export const GroupSection = () => {
    const groupData = useGetCategoriesWithGroupsAndCaseCountForActivePathogen();

    if (!groupData) return null;

    return (
        <Accordion
            type="multiple"
            data-tutorial-tour-step="data-management-group-section"
            defaultValue={["data-management-group-section"]}
            className="bg-white rounded-lg p-3"
        >
            <AccordionItem value="data-management-group-section">
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
                                columns={groupTableColumns}
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
