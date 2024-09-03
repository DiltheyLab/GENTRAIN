import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";

export function SampleInformationTable() {
    const casesWithRelationships = useCoreStore((state) => state.casesWithRelationships);
    const casesWithSamples = casesWithRelationships.filter((caseData) => caseData.sample);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    const renderHeadRow = () => {
        return (
            <TableRow className="font-medium bg-muted">
                <TableHead className="font-medium p-2 text-xs text-black">Fall ID</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Sequenz ID</TableHead>
                {activePathogen?.pathogen_type?.name === PathogenTypeName.virus && (
                    <>
                        <TableHead className="font-medium p-2 text-xs text-black">N's</TableHead>
                        <TableHead className="font-medium p-2 text-xs text-black">Abstammung</TableHead>
                        <TableHead className="font-medium p-2 text-xs text-black">Sequenzlänge</TableHead>
                    </>
                )}
                <TableHead className="font-medium p-2 text-xs text-black">Ausbruch</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Registrierungsdatum</TableHead>
                <TableHead className="font-medium p-2 text-xs text-black">Gruppen</TableHead>
            </TableRow>
        );
    };

    const renderRows = () => {
        return casesWithSamples.map((caseData) => {
            return (
                <TableRow key={caseData.id} className="border-muted">
                    <TableCell className="p-2 text-xs font-medium">{caseData.case_id}</TableCell>
                    <TableCell className="p-2 text-xs font-medium">{caseData.sample?.fasta_id}</TableCell>
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.virus && (
                        <>
                            <TableCell className="p-2 text-xs font-medium">{caseData.sample?.n_count}</TableCell>
                            <TableCell className="p-2 text-xs font-medium">{caseData.sample?.lineage}</TableCell>
                            <TableCell className="p-2 text-xs font-medium">
                                {caseData.sample?.sequence_length}
                            </TableCell>
                        </>
                    )}
                    <TableCell className="p-2 text-xs font-medium">
                        {caseData.outbreak?.name ?? "Keinem Ausbruch zugewiesen"}
                    </TableCell>
                    <TableCell className="p-2 text-xs font-medium">
                        {caseData.registered_at.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="p-2 text-xs font-medium">
                        {caseData.groups?.map((group) => group.name).join(", ") ?? "Keiner Gruppe zugewiesen"}
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
}
