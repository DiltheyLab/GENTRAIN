import { socket } from "@/modules/core/helpers/socket";
import { db } from "@/modules/core/infrastructure/database";
import { getPathogenTypeForActivePathogen } from "@/modules/core/models/pathogen_types";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";

export class ViralSequenceAnalysis extends SequenceAnalysisStrategy {
    createSampleAndSequenceAnalysis = async (fastaId: string, sequenceAnalysisResult: any, sequenceLength: number) => {
        const sequenceAnalysisId = await db.sequence_analyses.add({
            schema: "nextclade",
            result: {
                sequence_length: sequenceLength,
                lineage: sequenceAnalysisResult["lineage"],
                n_count: sequenceAnalysisResult["n_count"],
                mutations: {
                    substitutions: sequenceAnalysisResult["substitutions"],
                    deletions: sequenceAnalysisResult["deletions"],
                    insertions: sequenceAnalysisResult["insertions"],
                    missing: sequenceAnalysisResult["missing"],
                    nonACGTNs: sequenceAnalysisResult["nonACGTNs"],
                    alignmentRange: sequenceAnalysisResult["alignmentRange"],
                },
            },
        });
        await db.samples.add({
            fasta_id: fastaId,
            sequence_analysis_id: sequenceAnalysisId,
        });
    };
    getAndPersistVariantsForSamples = async () => {
        if (!this.sampleData) {
            return;
        }
        const variantRequestPromises: Promise<void>[] = [];
        for (const sample of this.sampleData) {
            // skip sample if it was excluded from uploads
            if (!Object.keys(this.dataManagementState.uploads).includes(sample.fastaId)) {
                continue;
            }
            // found case (only import if case exists)
            const sampleCase = await db.cases.where({ fasta_id: sample.fastaId }).first();
            // we currently only add samples if a case for the fasta id exists already
            // otherwise we would maximize the necessary amount of variant calculations
            if (sampleCase) {
                variantRequestPromises.push(this.getAndPersistVariantsForSample(sample));
                this.fastaIdsToAnalyse.push(sample.fastaId);
            }
        }
        const finishedFastaIds = [];

        if (socket) {
            socket.on(`sequence_analysis_response`, async (data: any) => {
                this.createSampleAndSequenceAnalysis(data.fasta_id, data.result, data.sequence_length);
                this.dataManagementState.changeUpload(data.fasta_id, "finished");
                finishedFastaIds.push(data.fasta_id);
                if (finishedFastaIds.length === this.fastaIdsToAnalyse.length) {
                    const activePathogenType = await getPathogenTypeForActivePathogen();
                    if (!activePathogenType) {
                        return;
                    }
                    // recalculate all sample distances to enable assembling a fresh distance matrix
                    const distanceCalculationStrategy = await PathogenStrategyManager.getDistanceCalculationStrategy();
                    if (!distanceCalculationStrategy) return;
                    await distanceCalculationStrategy.execute();
                    this.dataManagementState.setIsUploading(false);
                }
            });
        }

        await Promise.all(variantRequestPromises);
    };
}
