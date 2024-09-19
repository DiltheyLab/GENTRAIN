import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { DistanceMatrixTable } from "../distance_matrix/DistanceMatrixTable";
import { ClusterInformationTable } from "./ClusterInformationTable";
import { SampleInformationTable } from "./SampleInformationTable";
import { useDashboardStore } from "../../stores/dashboard";

export const InformationTables = () => {
    const coloringMode = useDashboardStore((state) => state.graphSettings.coloringMode);
    return (
        <Accordion type="multiple" className="mt-4">
            {coloringMode === "clusters" ? (
                <AccordionItem value="item-1">
                    <AccordionTrigger className="py-2">Informationen über die gefundenen Cluster</AccordionTrigger>
                    <AccordionContent>
                        <ClusterInformationTable />
                    </AccordionContent>
                </AccordionItem>
            ) : (
                <AccordionItem value="item-2">
                    <AccordionTrigger className="py-2">
                        Informationen zu den im Datensatz enthaltenen Fällen
                    </AccordionTrigger>
                    <AccordionContent>
                        <SampleInformationTable />
                    </AccordionContent>
                </AccordionItem>
            )}
            <AccordionItem value="item-3">
                <AccordionTrigger className="py-2">
                    Genetische Distanzen der im Datensatz enthaltenen Fälle
                </AccordionTrigger>
                <AccordionContent>
                    <DistanceMatrixTable />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
