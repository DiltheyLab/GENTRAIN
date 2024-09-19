import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";

export function SampleInformationTable() {
    const casesWithRelationships = useCoreStore((state) => state.casesWithRelationships);
    const casesWithSamples = casesWithRelationships.filter((caseData) => caseData.sample);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    const renderHeadRow = () => {
        return (
            <TableRow className="bg-muted">
                <TableHead className="p-2 text-xs text-black">Fall ID</TableHead>
                <TableHead className="p-2 text-xs text-black">Sequenz ID</TableHead>
                {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                    <>
                        <TableHead className="p-2 text-xs text-black">N's</TableHead>
                        <TableHead className="p-2 text-xs text-black">Abstammung</TableHead>
                        <TableHead className="p-2 text-xs text-black">Sequenzlänge</TableHead>
                    </>
                )}
                <TableHead className="p-2 text-xs text-black">Ausbruch</TableHead>
                <TableHead className="p-2 text-xs text-black">Registrierungsdatum</TableHead>
                <TableHead className="p-2 text-xs text-black">Gruppen</TableHead>
            </TableRow>
        );
    };

    const renderRows = () => {
        return casesWithSamples.map((caseData) => {
            return (
                <TableRow key={caseData.id} className="border-muted">
                    <TableCell className="p-2 text-xs">
                        <p>{caseData.case_id}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
                        <p>{caseData.sample?.fasta_id}</p>
                    </TableCell>
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                        <>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.n_count}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.lineage}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.sequence_length}</p>
                            </TableCell>
                        </>
                    )}
                    <TableCell className="p-2 text-xs">
                        <p>{caseData.outbreak?.name ?? "Keinem Ausbruch zugewiesen"}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
                        <p>{caseData.registered_at.toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
                        <p>{caseData.groups?.map((group) => group.name).join(", ") ?? "Keiner Gruppe zugewiesen"}</p>
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <>
            {casesWithSamples.length > 0 && (
                <>
                    <p>Es sind {casesWithSamples.length} sequenzierte Fälle im Datensatz.</p>
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
