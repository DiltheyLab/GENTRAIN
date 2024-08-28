import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { useGetAllSamples } from "@/modules/core/hooks/database/samples/useGetAllSamples";

export function SampleInformationTable() {
    const sampleData = useGetAllSamples();

    const renderHeadRow = () => {
        return (
            <TableRow className="font-medium bg-muted">
                <TableHead className="font-medium p-2 text-xs text-black">Fasta Id</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Lineage</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Ambigious Characters</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Letztes Änderungsdatum</TableHead>
            </TableRow>
        );
    };

    const renderRows = () => {
        if (sampleData) {
            return sampleData.map((row, rowIndex) => {
                return (
                    <TableRow key={rowIndex} className="border-muted">
                        <TableCell className="p-2 text-xs font-medium">{row.fasta_id}</TableCell>
                        <TableCell className="p-2 text-xs font-medium">{row.lineage}</TableCell>
                        <TableCell className="p-2 text-xs font-medium">{row.n_count}</TableCell>
                        <TableCell className="p-2 text-xs">
                            {row.updated_at ? row.updated_at.toLocaleDateString() : ""}
                        </TableCell>
                    </TableRow>
                );
            });
        }
    };

    return (
        <>
            {sampleData && (
                <>
                    <small>Es sind {sampleData.length} Fälle im Datensatz.</small>
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
}
