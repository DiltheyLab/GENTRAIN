import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { formatDate, parseGermanDateFormat } from "@/modules/core/helpers/dates";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";

export function SampleInformationTable() {
    const casesWithRelationships = useCoreStore((state) => state.casesWithRelationships);
    const casesWithSamples = casesWithRelationships.filter((caseData) => caseData.sample);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    const renderHeadRow = () => {
        return (
            <TableRow className="bg-muted font-medium">
                <TableHead className="p-2 text-xs text-black">Fall ID</TableHead>
                <TableHead className="p-2 text-xs text-black">Sequenz ID</TableHead>
                {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                    <>
                        <TableHead className="p-2 text-xs text-black">N's</TableHead>
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
                <TableHead className="p-2 text-xs text-black">Registrierungsdatum</TableHead>
                <TableHead className="p-2 text-xs text-black">Gruppen</TableHead>
            </TableRow>
        );
    };

    const renderRows = () => {
        return casesWithSamples.map((caseData) => {
            return (
                <TableRow key={caseData.id} className="border-muted font-medium">
                    <TableCell className="p-2 text-xs ">{caseData.case_id}</TableCell>
                    <TableCell className="p-2 text-xs">{caseData.sample?.fasta_id}</TableCell>
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                        <>
                            <TableCell className="p-2 text-xs">{caseData.sample?.n_count}</TableCell>
                            <TableCell className="p-2 text-xs">{caseData.sample?.lineage}</TableCell>
                            <TableCell className="p-2 text-xs">{caseData.sample?.sequence_length}</TableCell>
                        </>
                    )}
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial && (
                        <>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.contig_count}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.first_contig_length}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.undeterminable_gen_count}</p>
                            </TableCell>
                        </>
                    )}
                    <TableCell className="p-2 text-xs">
                        <p>{caseData.outbreak?.name ?? "Keinem Ausbruch zugewiesen"}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
                        <p>{formatDate(caseData.registered_at)}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
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
