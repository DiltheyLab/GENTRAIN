import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { useDashboardStore } from "../../stores/dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { CustomNode } from "@/modules/core/types/graph";

export const ClusterInformationTable = () => {
    const clusters = useDashboardStore((state) => state.clusters);

    const renderHeadRow = () => {
        return (
            <TableRow className="font-medium bg-muted">
                <TableHead className="font-medium p-2 text-xs text-black">Fall ID</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Sequenz ID</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">N's</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Ausbruch</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Registrierungsdatum</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Gruppen</TableHead>
            </TableRow>
        );
    };

    const renderRows = (nodes: (CustomNode | undefined)[]) => {
        return nodes.map((node) => {
            if (!node) return null;

            return (
                <TableRow key={node.id} className="border-muted">
                    <TableCell className="p-2 text-xs font-medium">{node.caseData.case_id}</TableCell>
                    <TableCell className="p-2 text-xs font-medium">{node.caseData.sample?.fasta_id}</TableCell>
                    <TableCell className="p-2 text-xs font-medium">{node.caseData.sample?.n_count}</TableCell>
                    <TableCell className="p-2 text-xs font-medium">{node.cluster}</TableCell>
                    <TableCell className="p-2 text-xs font-medium">
                        {node.caseData.registered_at.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="p-2 text-xs font-medium">
                        {node.caseData.groups?.map((group) => group.name).join(", ") ?? "Keiner Gruppe zugewiesen"}
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <Accordion type="multiple" className="px-0 rounded-lg">
            {clusters?.map((cluster, index) => {
                return (
                    <AccordionItem key={index} value={`cluster-${index}`} className="">
                        <AccordionTrigger className="text-base font-semibold py-1">
                            Cluster {index + 1}
                        </AccordionTrigger>
                        <AccordionContent>
                            <small>
                                Es sind {cluster.length} sequenzierte Fälle im Cluster {index + 1}.
                            </small>
                            <div className="border-[1px] border-muted rounded-xl overflow-hidden">
                                <Table className="rounded-xl overflow-hidden" id="sample-information-table">
                                    <TableHeader>{renderHeadRow()}</TableHeader>
                                    <TableBody>{renderRows(cluster)}</TableBody>
                                </Table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
};
