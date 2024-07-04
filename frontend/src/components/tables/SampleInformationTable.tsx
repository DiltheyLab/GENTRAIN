import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSamplesGetAll } from "@/database/samples";

export function SampleInformationTable() {
    const sampleData = useSamplesGetAll();

    const renderHeadRow = () => {
        return (
            <TableRow className="font-medium bg-muted">
                <TableHead className="font-medium p-2 text-xs text-black">Fasta Id</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">IMS Id</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Group</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Lineage</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Ambiguous Characters</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Sending Lab</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Sequencing Lab</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Metadata</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Sample Datum</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Letztes Änderungsdatum</TableHead>
            </TableRow>
        );
    };

    const renderRows = () => {
        if (sampleData) {
            return sampleData.map((row, rowIndex) => {
                return (
                    <TableRow key={rowIndex} className="border-muted">
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
                <div className="border-[1px] border-muted rounded-xl overflow-hidden">
                    <Table className="rounded-xl overflow-hidden">
                        <TableHeader>{renderHeadRow()}</TableHeader>
                        <TableBody>{renderRows()}</TableBody>
                    </Table>
                </div>
            )}
        </>
    );
}
