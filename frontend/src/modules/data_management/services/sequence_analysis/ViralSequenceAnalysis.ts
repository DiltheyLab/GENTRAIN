import {db} from "@/modules/core/services/database/DatabaseManager";
import {SequenceAnalysisStrategy} from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket.ts";
import {v4 as uuidv4} from "uuid";

export class ViralSequenceAnalysis extends SequenceAnalysisStrategy {
    protected parallelAnalysesThreshold = 100;

    public createSampleAndSequenceAnalysis = async (
        fastaId: string,
        sequenceAnalysisResult: any,
    ) => {
        const sequenceAnalysisId = await db.sequence_analyses.add({
            schema: sequenceAnalysisResult["analysis_schema"],
            nextclade_version: sequenceAnalysisResult["nextclade_version"],
            result: {
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
            sequence_length: sequenceAnalysisResult["sequence_length"],
            lineage: sequenceAnalysisResult["lineage"],
            n_count: sequenceAnalysisResult["n_count"],
            sequence_analysis_id: sequenceAnalysisId,
        });
    }

    protected emitSequenceAnalysis = () => {
        const batchIdentifier = uuidv4();
        // use total amount of sequences to analyse or the amount of finished analyses for socket message limit
        // depending on which value is lower
        const socketMessageLimit = Math.min(
            this.finishedFastaIds.length + this.parallelAnalysesThreshold,
            Object.keys(this.fastaIdsToAnalyse).length
        );
        // always send max. 10 message via websockt channel to regulate user inputs
        let fastaString = ""
        const sequenceIdentifiers = []
        for (let i = this.finishedFastaIds.length; i < socketMessageLimit; i++) {
            const fastaIdToAnalyse = this.fastaIdsToAnalyse[Object.keys(this.fastaIdsToAnalyse)[i]];
            const sequenceIdentifier = Object.keys(this.fastaIdsToAnalyse)[i];
            sequenceIdentifiers.push(sequenceIdentifier)
            fastaString += `>${sequenceIdentifier}\n${this.sampleData[fastaIdToAnalyse].imported.sequence}\n`
        }
        gentrainWebsocketInstance.viralSequenceAnalysisEmit(
            this.pathogen.id,
            batchIdentifier,
            fastaString,
            sequenceIdentifiers
        );
    }


    public getQualityParameters = (sequence: string) => {
        const nCount = (sequence.match(/N/g) || []).length;
        const ambiguityCharacterCount = (sequence.match(/[BDHKMRSUVWY]/g) || []).length;
        return {
            sequence_length: sequence.length,
            n_count: nCount,
            ambiguity_character_count: ambiguityCharacterCount,
        };
    };
}
