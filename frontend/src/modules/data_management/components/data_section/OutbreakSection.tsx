import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { uploadedOutbreakColumns } from "./uploadedOutbreakColumns";
import { useGetOutbreaksWithCaseCountForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksWithCaseCountForActivePathogen";

export const OutbreakSection = () => {
    const outbreakData = useGetOutbreaksWithCaseCountForActivePathogen();
    if (!outbreakData) return null;

    return (
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
    );
};
