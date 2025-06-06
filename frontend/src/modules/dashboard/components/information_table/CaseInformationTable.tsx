import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/core/components/ui/Table";
import { formatDate } from "@/modules/core/helpers/dates";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { BacterialAnalysisResult, ViralAnalysisResult } from "@/modules/core/models/sequence_analyses";
import { useCoreStore } from "@/modules/core/stores/core";
import { t } from "i18next";

export function CaseInformationTable() {
    const casesWithRelationships = useCoreStore((state) => state.casesWithRelationships);
    const casesWithSequenceAnalysis = casesWithRelationships.filter((caseData) => caseData.sequence_analysis);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const renderHeadRow = () => {
        return (
            <TableRow className="bg-muted font-medium">
                <TableHead className="p-2 text-xs text-black">Fall ID</TableHead>
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

    const renderQualityParameterCells = (caseData: CaseWithRelationships) => {
        if (activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial) {
            return (
                <>
                    <TableCell className="p-2 text-xs">
                        <p>{(caseData.sequence_analysis?.result as BacterialAnalysisResult)?.contig_count}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
                        <p>{(caseData.sequence_analysis?.result as BacterialAnalysisResult)?.first_contig_length}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs">
                        <p>
                            {(caseData.sequence_analysis?.result as BacterialAnalysisResult)?.undeterminable_gen_count}
                        </p>
                    </TableCell>
                </>
            );
        }
        return (
            <>
                <TableCell className="p-2 text-xs">
                    <p>{(caseData.sequence_analysis?.result as ViralAnalysisResult)?.n_count}</p>
                </TableCell>
                <TableCell className="p-2 text-xs">
                    <p>{(caseData.sequence_analysis?.result as ViralAnalysisResult)?.ambiguity_character_count}</p>
                </TableCell>
                <TableCell className="p-2 text-xs">
                    <p>{(caseData.sequence_analysis?.result as ViralAnalysisResult)?.lineage}</p>
                </TableCell>
                <TableCell className="p-2 text-xs">
                    <p>{(caseData.sequence_analysis?.result as ViralAnalysisResult)?.sequence_length}</p>
                </TableCell>
            </>
        );
    };

    const renderRows = () => {
        return casesWithRelationships.map((caseData) => {
            return (
                <TableRow key={caseData.id} className="border-muted">
                    <TableCell className="p-2 text-xs font-medium">{caseData.case_id}</TableCell>
                    {renderQualityParameterCells(caseData)}
                    <TableCell className="p-2 text-xs">
                        <p>{caseData.outbreak?.name ?? t("clusterTypes.noOutbreakAssigned")}</p>
                    </TableCell>
                    <TableCell className="p-2 text-xs max-w-60">
                        <div>
                            {caseData.groups?.map((group) => (
                                <p key={`${caseData.id}_${group.id}`}>
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
                Es sind {casesWithRelationships.length} Fälle im Datensatz. Zu {casesWithSequenceAnalysis.length} Fällen
                liegen Sequenzen vor.
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
