import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSamplesGetAll } from "@/database/samples";

export function SampleInformationTable() {
    const sampleData = useSamplesGetAll();

    const renderHeadRow = () => {
        return (
            <TableRow>
                <TableHead className="font-medium p-2 text-xs">Fasta ID</TableHead>
                <TableHead className="font-medium p-2 text-xs">IMS ID</TableHead>
                <TableHead className="font-medium p-2 text-xs">Group</TableHead>
                <TableHead className="font-medium p-2 text-xs">Lineage</TableHead>
                <TableHead className="font-medium p-2 text-xs">Ambiguous Characters</TableHead>
                <TableHead className="font-medium p-2 text-xs">Sending Lab</TableHead>
                <TableHead className="font-medium p-2 text-xs">Sequencing Lab</TableHead>
                <TableHead className="font-medium p-2 text-xs">Metadata</TableHead>
                <TableHead className="font-medium p-2 text-xs">Sample Datum</TableHead>
                <TableHead className="font-medium p-2 text-xs">Letztes Änderungsdatum</TableHead>
            </TableRow>
        );
    };

    const renderRows = () => {
        if (sampleData) {
            return sampleData.map((row, rowIndex) => {
                return (
                    <TableRow key={rowIndex} className="border-b-[1px] border-r-[1px] border-muted p-2">
                        <TableCell className="p-2 text-xs">{row.fasta_id}</TableCell>
                        <TableCell className="p-2 text-xs">{row.ims_id}</TableCell>
                        <TableCell className="p-2 text-xs">{row.group}</TableCell>
                        <TableCell className="p-2 text-xs">{row.lineage}</TableCell>
                        <TableCell className="p-2 text-xs">{row.n_count}</TableCell>
                        <TableCell className="p-2 text-xs">{row.location_sending_lab}</TableCell>
                        <TableCell className="p-2 text-xs">{row.location_sequencing_lab}</TableCell>
                        <TableCell className="p-2 text-xs">{row.metadata}</TableCell>
                        <TableCell className="p-2 text-xs">{row.sampled_at}</TableCell>
                        <TableCell className="p-2 text-xs">{row.updated_at.toLocaleString()}</TableCell>
                    </TableRow>
                );
            });
        }
    };

    return (
        <>
            {sampleData && (
                <Table className="rounded-xl overflow-hidden border-b-[1px] border-muted">
                    <TableHeader>{renderHeadRow()}</TableHeader>
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            )}
        </>
    );
}
