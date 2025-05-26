import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { useDashboardStore } from "../../stores/dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { CustomNode } from "@/modules/core/types/graph";
import { ColorCircle } from "@/modules/core/components/graph/ColorCircle";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";
import { formatDate } from "@/modules/core/helpers/dates";
import { t } from "i18next";
import { ClusterToOutbreakDialog } from "./ClusterToOutbreakDialog";
import { Card, CardContent } from "@/modules/core/components/ui/Card";

export const ClusterInformationTable = () => {
    const clusters = useDashboardStore((state) => state.clusters);
    const colorMap = useDashboardStore((state) => state.graphSettings.colorMap);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const noClusterAssigned = useDashboardStore((state) => state.graphData.nodes).filter(
        (node) => node.cluster === t("clusterTypes.noClusterAssigned")
    );

    const renderHeadRow = () => {
        return (
            <TableRow className="bg-muted font-medium">
                <TableHead className="p-2 text-xs text-black">Fall ID</TableHead>
                <TableHead className="p-2 text-xs text-black">Sequenz ID</TableHead>
                {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                    <>
                        <TableHead className="p-2 text-xs text-black">Ns</TableHead>
                        <TableHead className="p-2 text-xs text-black">IUPAC Ambiguity Characters</TableHead>
                        <TableHead className="p-2 text-xs text-black">Abstammung</TableHead>
                        <TableHead className="p-2 text-xs text-black">Sequenzlänge</TableHead>
                    </>
                )}
                {activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial && (
                    <>
                        <TableHead className="p-2 text-xs text-black">Contigs</TableHead>
                        <TableHead className="p-2 text-xs text-black">Länge erster Contig</TableHead>
                        <TableHead className="p-2 text-xs text-black">Unbestimmbare Gene</TableHead>
                    </>
                )}
                <TableHead className="p-2 text-xs text-black">Ausbruch</TableHead>
                <TableHead className="p-2 text-xs text-black">Gruppen</TableHead>
                <TableHead className="p-2 text-xs text-black">Registrierungsdatum</TableHead>
            </TableRow>
        );
    };

    const renderRows = (nodes: (CustomNode | undefined)[]) => {
        return nodes.map((node) => {
            if (!node) return null;

            return (
                <TableRow key={node.caseData.id} className="border-muted">
                    <TableCell className="p-2 text-xs  font-medium ">{node.caseData.case_id}</TableCell>
                    <TableCell className="p-2 text-xs">{node.caseData.sample?.fasta_id}</TableCell>
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                        <>
                            <TableCell className="p-2 text-xs">
                                <p>{node.caseData.sample?.n_count}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{node.caseData.sample?.ambiguity_character_count}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{node.caseData.sample?.lineage}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{node.caseData.sample?.sequence_length}</p>
                            </TableCell>
                        </>
                    )}
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial && (
                        <>
                            <TableCell className="p-2 text-xs">
                                <p>{node.caseData.sample?.contig_count}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{node.caseData.sample?.first_contig_length}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{node.caseData.sample?.undeterminable_gen_count}</p>
                            </TableCell>
                        </>
                    )}
                    <TableCell className="p-2 text-xs">
                        <p>{node.caseData.outbreak?.name ?? t("clusterTypes.noOutbreakAssigned")}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs max-w-60">
                        <div>
                            {node.caseData.groups?.map((group) => (
                                <p>
                                    <span className="font-medium">{group.category?.name}: </span>
                                    {group.name}
                                </p>
                            )) ?? <p>Keiner Gruppe zugewiesen</p>}
                        </div>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
                        <p>{formatDate(node.caseData.registered_at)}</p>
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <Card>
            <CardContent>
                <Accordion type="multiple" className="px-0 rounded-lg">
                    {clusters?.map((cluster, index) => {
                        return (
                            <AccordionItem key={index} value={`${index}`} className="mt-2">
                                <div className="flex justify-between items-center">
                                    <AccordionTrigger className="font-semibold py-3 w-full space-x-1">
                                        <div className="flex items-center gap-2">
                                            <ColorCircle colorMap={colorMap} cluster={`Cluster ${index + 1}`} />
                                            <h4 className="text-base">Cluster {index + 1}</h4>
                                        </div>
                                    </AccordionTrigger>
                                    <ClusterToOutbreakDialog
                                        cluster={cluster}
                                        clusterName={`Cluster ${index + 1}`}
                                        colorMap={colorMap}
                                    />
                                </div>
                                <AccordionContent>
                                    <small>
                                        Es sind {cluster.length} sequenzierte Fälle im Cluster {index + 1}.
                                    </small>
                                    <div className="border-[1px] border-muted rounded-xl max-h-96 overflow-auto">
                                        <Table className="rounded-xl">
                                            <TableHeader>{renderHeadRow()}</TableHeader>
                                            <TableBody>{renderRows(cluster)}</TableBody>
                                        </Table>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                    {noClusterAssigned.length > 0 && (
                        <AccordionItem value={`noOutbreakAssigned`} className="mt-2">
                            <div className="flex justify-between items-center">
                                <AccordionTrigger className="font-semibold py-3 w-full space-x-1">
                                    <div className="flex items-center gap-2">
                                        <ColorCircle
                                            colorMap={colorMap}
                                            cluster={t("clusterTypes.noClusterAssigned")}
                                        />
                                        <h4 className="text-base">{t("clusterTypes.noClusterAssigned")}</h4>
                                    </div>
                                </AccordionTrigger>
                                <ClusterToOutbreakDialog
                                    cluster={noClusterAssigned}
                                    clusterName={t("clusterTypes.noClusterAssigned")}
                                    colorMap={colorMap}
                                />
                            </div>
                            <AccordionContent>
                                <small>
                                    Es sind {noClusterAssigned.length} sequenzierte Fälle die keinem Cluster zugewiesen
                                    wurden.
                                </small>
                                <div className="border-[1px] border-muted rounded-xl max-h-96 overflow-auto">
                                    <Table className="rounded-xl">
                                        <TableHeader>{renderHeadRow()}</TableHeader>
                                        <TableBody>{renderRows(noClusterAssigned)}</TableBody>
                                    </Table>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </CardContent>
        </Card>
    );
};
