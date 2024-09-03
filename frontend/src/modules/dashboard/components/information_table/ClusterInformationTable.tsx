import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { useDashboardStore } from "../../stores/dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { CustomNode } from "@/modules/core/types/graph";
import { ColorCircle } from "@/modules/core/components/graph/ColorCircle";

export const ClusterInformationTable = () => {
    const clusters = useDashboardStore((state) => state.clusters);
    const colorMap = useDashboardStore((state) => state.graphSettings.colorMap);

    const renderHeadRow = (nodes: (CustomNode | undefined)[]) => {
        return (
            <TableRow className="font-medium bg-muted">
                <TableHead className="font-medium p-2 text-xs text-black">Fall ID</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Sequenz ID</TableHead>
                {nodes?.[0]?.caseData.sample?.n_count !== undefined && (
                    <TableHead className="font-medium p-2 text-xs text-black">N's</TableHead>
                )}
                {nodes?.[0]?.caseData.sample?.lineage && (
                    <TableHead className="font-medium p-2 text-xs text-black">Lineage</TableHead>
                )}
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
                    {node.caseData.sample?.n_count !== undefined && (
                        <TableCell className="p-2 text-xs font-medium">{node.caseData.sample.n_count}</TableCell>
                    )}
                    {node.caseData.sample?.lineage && (
                        <TableCell className="p-2 text-xs font-medium">{node.caseData.sample?.lineage}</TableCell>
                    )}
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
                    <AccordionItem key={index} value={`${index}`} className="">
                        <AccordionTrigger className=" font-semibold py-1">
                            <div className="flex items-center gap-2">
                                <ColorCircle colorMap={colorMap} cluster={`Cluster ${index + 1}`} />
                                <p>Cluster {index + 1}</p>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <small>
                                Es sind {cluster.length} sequenzierte Fälle im Cluster {index + 1}.
                            </small>
                            <div className="border-[1px] border-muted rounded-xl overflow-hidden">
                                <Table className="rounded-xl overflow-hidden">
                                    <TableHeader>{renderHeadRow(cluster)}</TableHeader>
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
