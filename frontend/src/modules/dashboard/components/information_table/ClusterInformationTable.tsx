import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { useDashboardStore } from "../../stores/dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { CustomNode } from "@/modules/core/types/graph";
import { ColorCircle } from "@/modules/core/components/graph/ColorCircle";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";

export const ClusterInformationTable = () => {
    const clusters = useDashboardStore((state) => state.clusters);
    const colorMap = useDashboardStore((state) => state.graphSettings.colorMap);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    const renderHeadRow = () => {
        return (
            <TableRow className="font-light bg-muted">
                <TableHead className="font-light p-2 text-xs text-black">Fall ID</TableHead>
                <TableHead className="font-light p-2 text-xs text-black">Sequenz ID</TableHead>
                {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                    <>
                        <TableHead className="font-light p-2 text-xs text-black">N's</TableHead>
                        <TableHead className="font-light p-2 text-xs text-black">Abstammung</TableHead>
                        <TableHead className="font-light p-2 text-xs text-black">Sequenzlänge</TableHead>
                    </>
                )}
                <TableHead className="font-light p-2 text-xs text-black">Ausbruch</TableHead>
                <TableHead className="font-light p-2 text-xs text-black">Registrierungsdatum</TableHead>
                <TableHead className="font-light p-2 text-xs text-black">Gruppen</TableHead>
            </TableRow>
        );
    };

    const renderRows = (nodes: (CustomNode | undefined)[]) => {
        return nodes.map((node) => {
            if (!node) return null;

            return (
                <TableRow key={node.id} className="border-muted">
                    <TableCell className="p-2 text-xs font-light">{node.caseData.case_id}</TableCell>
                    <TableCell className="p-2 text-xs font-light">{node.caseData.sample?.fasta_id}</TableCell>
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                        <>
                            <TableCell className="p-2 text-xs font-light">{node.caseData.sample?.n_count}</TableCell>
                            <TableCell className="p-2 text-xs font-light">{node.caseData.sample?.lineage}</TableCell>
                            <TableCell className="p-2 text-xs font-light">
                                {node.caseData.sample?.sequence_length}
                            </TableCell>
                        </>
                    )}
                    <TableCell className="p-2 text-xs font-light">{node.cluster}</TableCell>
                    <TableCell className="p-2 text-xs font-light">
                        {node.caseData.registered_at.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="p-2 text-xs font-light">
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
                            <p>
                                Es sind {cluster.length} sequenzierte Fälle im Cluster {index + 1}.
                            </p>
                            <div className="border-[1px] border-muted rounded-xl overflow-hidden">
                                <Table className="rounded-xl overflow-hidden">
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
