import { socket } from "@/modules/core/helpers/socket";
import { db } from "@/modules/core/infrastructure/database";
import { getPathogenTypeForActivePathogen } from "@/modules/core/models/pathogen_types";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { SampleAnalysisStrategy } from "@/modules/data_management/services/sample_analysis/SampleAnalysisStrategy";

export class ViralSampleAnalysis extends SampleAnalysisStrategy {
    createSample = async (fastaId: string, sequenceLength: number, variantsResult: any) => {
        const sampleId = await db.samples.add({
            fasta_id: fastaId,
            sequence_length: sequenceLength,
            lineage: variantsResult["lineage"],
            n_count: variantsResult["n_count"],
            variants: {
                substitutions: variantsResult["substitutions"],
                deletions: variantsResult["deletions"],
                insertions: variantsResult["insertions"],
                missing: variantsResult["missing"],
                nonACGTNs: variantsResult["nonACGTNs"],
                alignmentRange: variantsResult["alignmentRange"],
            },
        });
        return sampleId;
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
            socket.on(`sample_analysis_response`, async (data: any) => {
                this.createSample(data.fasta_id, data.sequence_length, data.result);
                this.dataManagementState.changeUpload(data.fasta_id, "finished");
                finishedFastaIds.push(data.fasta_id);
                if (finishedFastaIds.length === this.fastaIdsToAnalyse.length) {
                    const activePathogenType = await getPathogenTypeForActivePathogen();
                    if (!activePathogenType) {
                        return;
                    }
                    this.coreState.updateCasesWithRelationships();
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
