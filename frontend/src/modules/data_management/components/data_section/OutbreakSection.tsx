import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { uploadedOutbreakColumns } from "./uploadedOutbreakColumns";
import { useGetOutbreaksWithCaseCountForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksWithCaseCountForActivePathogen";

export const OutbreakSection = () => {
    const outbreakData = useGetOutbreaksWithCaseCountForActivePathogen();
    if (!outbreakData) return null;

    return (
        <Accordion
            className="bg-white rounded-lg p-3"
            data-tutorial-tour-step="data-management-outbreak-section"
            type="multiple"
            defaultValue={["data-management-outbreak-section"]}
        >
            <AccordionItem value="data-management-outbreak-section">
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
    );
};
