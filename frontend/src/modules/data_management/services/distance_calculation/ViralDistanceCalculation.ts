import { referenceString } from "@/data/referenceString";
import { SampleSchema } from "@/modules/core/models/samples";
import { ViralAnalysisResult } from "@/modules/core/models/sequence_analyses";
import { DistanceCalculationStrategy } from "@/modules/data_management/services/distance_calculation/DistanceCalculationStrategy";
import { ViralDistanceExtractor } from "@/modules/data_management/services/distance_calculation/ViralDistanceExtractor";
import {
    ViralPositionExtractor,
    MutationsSchema,
} from "@/modules/data_management/services/distance_calculation/ViralPositionExtractor";

export class ViralDistanceCalculation extends DistanceCalculationStrategy {
    protected calculateSampleDistance = async (sample1: SampleSchema, sample2: SampleSchema) => {
        const viralDistanceExtractor = new ViralDistanceExtractor(sample1, sample2);
        const alignment = await this.alignSamples(sample1, sample2);
        console.log(alignment);
        viralDistanceExtractor.calculateDistance(alignment[0], alignment[1]);
        return viralDistanceExtractor.getDistance();
    };

    private alignSamples = async (sample1: SampleSchema, sample2: SampleSchema) => {
        const positionsSample1 = this.getMutationPositions(sample1);
        const positionsSample2 = this.getMutationPositions(sample2);
        let sequence1 = "";
        let sequence2 = "";
        for (let baseIndex = 0; baseIndex < referenceString.length; baseIndex++) {
            const refChar = referenceString[baseIndex];
            let mutations1 = positionsSample1[baseIndex];
            let mutations2 = positionsSample2[baseIndex];
            let additions1 = "";
            let additions2 = "";
            // the current reference char is added if no mutations for the current position exist
            additions1 += this.handleRemainedCharacter(mutations1, additions1, refChar);
            additions2 += this.handleRemainedCharacter(mutations2, additions2, refChar);
            // snp characters are added for both sequences
            additions1 = this.handleSnp(mutations1, additions1);
            additions2 = this.handleSnp(mutations2, additions2);
            [additions1, additions2] = this.handleDeletions(mutations1, mutations2, additions1, additions2);
            // to avoid unnecessary kalign executions we check if mutations contain differing insertion
            // we would then include the aligned insertion sequences
            if (this.checkForDifferingInsertions(mutations1, mutations2)) {
                [additions1, additions2] = await this.handleInsertionsWithAlignment(
                    mutations1,
                    mutations2,
                    additions1,
                    additions2,
                    refChar
                );
            }
            // if mutations do not contain differing insertions we can safely handle insertions without aligning them
            [additions1, additions2] = this.handleInsertionsWithoutAlignment(
                mutations1,
                mutations2,
                additions1,
                additions2,
                refChar
            );

            // all collected additions are concatenated to the current sequence states
            sequence1 += additions1;
            sequence2 += additions2;
        }
        return [sequence1, sequence2];
    };

    /**
     * Uses the ViralPositionService to generate a position dictionary containing mutation types as keys and characters and values.
     * @param sample
     * @returns
     */
    private getMutationPositions(sample: SampleSchema) {
        const sequenceAnalysis = sample.sequence_analysis?.result as ViralAnalysisResult;
        const viralPositionService = new ViralPositionExtractor(sequenceAnalysis);
        viralPositionService.collectPositions();
        return viralPositionService.getPositions();
    }

    /**
     * Add reference char if no mutations exist.
     * @param mutations
     * @param addition
     * @param refChar
     * @returns
     */
    private handleRemainedCharacter = (mutations: MutationsSchema, additions: string, refChar: string) => {
        if (!mutations) {
            additions = refChar + additions; //additions kann vermutlich weg
        }
        return additions;
    };

    /**
     * Add the snp char for mutations of type snp.
     * @param mutations
     * @param additions
     * @returns
     */
    private handleSnp = (mutations: MutationsSchema, additions: string) => {
        if (!mutations || !("snp" in mutations)) {
            return additions;
        }
        additions += mutations.snp;

        return additions;
    };

    /**
     * Add empty strings for both sequences if both mutation array contain contain a deletion.
     * If only one mutation array has a deletion, add "-" for this sequence.
     * @param mutations1
     * @param mutations2
     * @param additions1
     * @param additions2
     * @returns
     */
    private handleDeletions = (
        mutations1: MutationsSchema,
        mutations2: MutationsSchema,
        additions1: string,
        additions2: string
    ) => {
        if (
            (mutations1 && mutations2 && !("del" in mutations1) && !("del" in mutations2)) ||
            (mutations1 && mutations2 && "del" in mutations1 && "del" in mutations2)
        ) {
            return [additions1, additions2];
        }
        if (mutations1 && "del" in mutations1) {
            additions1 += "-";
        }
        if (mutations2 && "del" in mutations2) {
            additions2 += "-";
        }
        return [additions1, additions2];
    };

    /**
     * Recognize whether both mutations contain an insertion that is the same.
     * @param mutations1
     * @param mutations2
     * @returns
     */
    private checkForDifferingInsertions = (mutations1: MutationsSchema, mutations2: MutationsSchema) => {
        return (
            mutations1 && mutations2 && "ins" in mutations1 && "ins" in mutations2 && mutations1.ins !== mutations2.ins
        );
    };

    /**
     * Align insertion sequences and add the aligned sequences to current additon states.
     * @param mutations1
     * @param mutations2
     * @param additions1
     * @param additions2
     * @param refChar
     * @returns
     */
    private handleInsertionsWithAlignment = async (
        mutations1: MutationsSchema,
        mutations2: MutationsSchema,
        additions1: string,
        additions2: string,
        refChar: string
    ) => {
        const insertion1 = mutations1.ins;
        const insertion2 = mutations2.ins;
        const fasta_string = `>1\n${insertion1}\n>2\n${insertion2}`;
        let result = await this.cli.mount({
            name: "distance_input.fa",
            data: fasta_string,
        });
        result = await this.cli.exec("kalign distance_input.fa -f fasta -o distance_result.fasta");
        result = await this.cli.cat("distance_result.fasta");
        result = result.split(/[\r\n]+/);
        const alignedInsertion1 = result[1];
        const alignedInsertion2 = result[3];
        additions1 += Object.keys(mutations1).length > 1 ? alignedInsertion1 : refChar + additions1 + alignedInsertion1;
        additions2 += Object.keys(mutations2).length > 1 ? alignedInsertion2 : refChar + additions2 + alignedInsertion2;
        return [additions1, additions2];
    };

    /**
     * Insert the insertion string into the corresponding addition state and fill
     * the other addition state with "-", whereby the length of the insertion
     * string must be respected.
     * @param mutations1
     * @param mutations2
     * @param additions1
     * @param additions2
     * @param refChar
     * @returns
     */
    private handleInsertionsWithoutAlignment = (
        mutations1: MutationsSchema,
        mutations2: MutationsSchema,
        additions1: string,
        additions2: string,
        refChar: string
    ) => {
        if (mutations1 && mutations2 && !("ins" in mutations1) && !("ins" in mutations2)) {
            return [additions1, additions2];
        }
        if (mutations1 && mutations2 && "ins" in mutations1 && "ins" in mutations2) {
            let insertion1 = mutations1.ins;
            let insertion2 = mutations2.ins;
            additions1 += Object.keys(mutations1).length > 1 ? insertion1 : refChar + additions1 + insertion1;
            additions2 += Object.keys(mutations2).length > 1 ? insertion2 : refChar + additions2 + insertion2;
            return [additions1, additions2];
        }
        if (mutations1 && "ins" in mutations1) {
            const insertion = mutations1.ins;
            const gaps = new Array(insertion.length + 1).join("-");
            additions1 += Object.keys(mutations1).length > 1 ? insertion : refChar + additions1 + insertion;
            additions2 += gaps;
        }
        if (mutations2 && "ins" in mutations2) {
            const insertion = mutations2.ins;
            const gaps = new Array(insertion.length + 1).join("-");
            additions1 += gaps;
            additions2 += Object.keys(mutations2).length > 1 ? insertion : refChar + additions2 + insertion;
        }

        return [additions1, additions2];
    };
}
