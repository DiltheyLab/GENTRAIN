import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllCases } from "@/hooks/database/cases/useGetAllCases";

export function CaseInformationTable() {
    const caseData = useGetAllCases();

    const renderHeadRow = () => {
        return (
            <TableRow className="font-medium bg-muted">
                <TableHead className="font-medium p-2 text-xs text-black">Outbreak</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Sample</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Registrierungsdatum</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Letztes Änderungsdatum</TableHead>
            </TableRow>
        );
    };

    const renderRows = () => {
        if (caseData) {
            return caseData.map((row, rowIndex) => {
                return (
                    <TableRow key={rowIndex} className="border-muted">
                        <TableCell className="p-2 text-xs font-medium">{row.case_id}</TableCell>
                        <TableCell className="p-2 text-xs font-medium">
                            {row.outbreak ? row.outbreak.name : "Background"}
                        </TableCell>
                        <TableCell className="p-2 text-xs">
                            {row.sample && (
                                <>
                                    <div>
                                        <p>{row.sample.fasta_id}</p>
                                    </div>
                                    <div>
                                        <small>{row.sample.lineage ? row.sample.lineage : ""}</small>
                                    </div>
                                    <div>
                                        <small>{row.sample.n_count ? row.sample.n_count : ""}</small>
                                    </div>
                                </>
                            )}
                        </TableCell>
                        <TableCell className="p-2 text-xs">
                            {row.registered_at ? row.registered_at.toLocaleDateString() : ""}
                        </TableCell>
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
            {caseData && (
                <>
                    <small>Es sind {caseData.length} Fälle im Datensatz.</small>
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
