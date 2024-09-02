import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { useDashboardStore } from "../../stores/dashboard";
import { ClusterAnalyser } from "@/modules/core/services/graph/ClusterAnalyser";
import { useCoreStore } from "@/modules/core/stores/core";

export const ClusterInformationTable = () => {
    const graphData = useDashboardStore((state) => state.graphData);
    const clusteringThreshold = useDashboardStore((state) => state.settings.clusteringThreshold);
    const clusterAnalyser = new ClusterAnalyser(clusteringThreshold);
    const clusters = clusterAnalyser.findClusters(graphData);
    console.log(clusters);

    const cases = useCoreStore((state) => state.casesWithRelationships);
    const casesWithSamples = cases.filter((caseData) => caseData.sample);

    const renderHeadRow = () => {
        return (
            <TableRow className="font-medium bg-muted">
                <TableHead className="font-medium p-2 text-xs text-black">Fall ID</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Sequenz ID</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Lineage</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Ambigious Characters</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Letztes Änderungsdatum</TableHead>
            </TableRow>
        );
    };

    const renderRows = () => {
        return casesWithSamples.map((caseData) => {
            return (
                <TableRow key={caseData.id} className="border-muted">
                    <TableCell className="p-2 text-xs font-medium">{caseData.case_id}</TableCell>
                    <TableCell className="p-2 text-xs font-medium">{caseData.sample?.fasta_id}</TableCell>
                    <TableCell className="p-2 text-xs font-medium">{caseData.sample?.lineage}</TableCell>
                    <TableCell className="p-2 text-xs font-medium">{caseData.sample?.n_count}</TableCell>
                    <TableCell className="p-2 text-xs">
                        {caseData.sample?.updated_at ? caseData.sample?.updated_at.toLocaleDateString() : ""}
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <>
            {casesWithSamples.length > 0 && (
                <>
                    <small>Es sind {casesWithSamples.length} sequenzierte Fälle im Datensatz.</small>
                    <div className="mt-4 border-[1px] border-muted rounded-xl overflow-hidden">
                        <Table className="rounded-xl overflow-hidden" id="sample-information-table">
                            <TableHeader>{renderHeadRow()}</TableHeader>
                            <TableBody>{renderRows()}</TableBody>
                        </Table>
                    </div>
                </>
            )}
        </>
    );
};
