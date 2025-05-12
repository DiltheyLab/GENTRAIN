import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { formatDate } from "@/modules/core/helpers/dates";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";
import { t } from "i18next";

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

    const renderRows = () => {
        return casesWithRelationships.map((caseData) => {
            return (
                <TableRow key={caseData.id} className="border-muted">
                    <TableCell className="p-2 text-xs font-medium">{caseData.case_id}</TableCell>
                    <TableCell className="p-2 text-xs">{caseData.sample?.fasta_id}</TableCell>
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                        <>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.n_count}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.ambiguity_character_count}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.lineage}</p>
                            </TableCell>
                            <TableCell className="p-2 text-xs">
                                <p>{caseData.sample?.sequence_length}</p>
                            </TableCell>
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
                        <p>{caseData.outbreak?.name ?? t("clusterTypes.noOutbreakAssigned")}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs max-w-60">
                        <div>
                            {caseData.groups?.map((group) => (
                                <p>
                                    <span className="font-medium">{group.category?.name}: </span>
                                    {group.name}
                                </p>
                            )) ?? <p>Keiner Gruppe zugewiesen</p>}
                        </div>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
                        <p>{formatDate(caseData.registered_at)}</p>
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <>
            <small>
                Es sind {casesWithRelationships.length} Fälle im Datensatz. Zu {casesWithSamples.length} Fällen liegen
                Sequenzen vor.
            </small>
            <div className="mt-4 border-[1px] border-muted rounded-xl max-h-96 overflow-auto">
                <Table className="rounded-xl">
                    <TableHeader>{renderHeadRow()}</TableHeader>
                    <TableBody>{renderRows()}</TableBody>
                </Table>
            </div>
        </>
    );
}
