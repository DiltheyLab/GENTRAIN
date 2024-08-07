import { referenceString } from "@/data/referenceString";
import { SampleSchema } from "@/database/samples";
import { DistanceCalculationStrategy } from "./DistanceCalculationStrategy";
import { MutationsSchema, ViralPositionService } from "@/services/ViralPositionService";

export class ViralDistanceCalculation extends DistanceCalculationStrategy {
    calculateSampleDistance = async (sample1: SampleSchema, sample2: SampleSchema) => {
        let alignment = await this.alignSamples(sample1, sample2);
        // count of proper characters per sequence (so that in the beginning and end the first/last x chars can be skipped)
        let proper_total_1 = (sample1.sequence_length ?? 0) - (sample1.n_count ?? 0);
        let proper_total_2 = (sample2.sequence_length ?? 0) - (sample2.n_count ?? 0);

        // find all differences
        let distance = this.countDifferences(alignment, proper_total_1, proper_total_2);

        return distance;
    };

    alignSamples = async (sample1: SampleSchema, sample2: SampleSchema) => {
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
            additions1 += this.handleRemainedCharacter(mutations1, additions1, refChar);
            additions2 += this.handleRemainedCharacter(mutations2, additions2, refChar);
            additions1 = this.handleSnp(mutations1, additions1);
            additions2 = this.handleSnp(mutations2, additions2);
            [additions1, additions2] = this.handleDeletions(mutations1, mutations2, additions1, additions2);
            if (this.checkForDifferingInsertions(mutations1, mutations2)) {
                [additions1, additions2] = await this.handleInsertionsWithAlignment(
                    mutations1,
                    mutations2,
                    additions1,
                    additions2,
                    refChar
                );
            }
            [additions1, additions2] = this.handleInsertionsWithoutAlignment(
                mutations1,
                mutations2,
                additions1,
                additions2,
                refChar
            );

            sequence1 += additions1;
            sequence2 += additions2;
        }
        return [sequence1, sequence2];
    };

    handleRemainedCharacter = (mutations: MutationsSchema, addition: string, refChar: string) => {
        if (!mutations) {
            addition = refChar + addition;
        }
        return addition;
    };

    handleSnp = (mutations: MutationsSchema, additions: string) => {
        if (!mutations || !("snp" in mutations)) {
            return additions;
        }
        additions += mutations.snp;

        return additions;
    };

    handleDeletions = (
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

    checkForDifferingInsertions = (mutations1: MutationsSchema, mutations2: MutationsSchema) => {
        return (
            mutations1 && mutations2 && "ins" in mutations1 && "ins" in mutations2 && mutations1.ins !== mutations2.ins
        );
    };

    handleInsertionsWithAlignment = async (
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

    handleInsertionsWithoutAlignment = (
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

    getMutationPositions(sample: SampleSchema) {
        const viralPositionService = new ViralPositionService(sample);
        viralPositionService.collectPositions();
        return viralPositionService.getPositions();
    }

    countDifferences = (alignment: any, proper_total_1: any, proper_total_2: any) => {
        // return val
        let distance = 0;

        // skip this many proper chars in the beginning and end because of sequencing accuracy
        let skip_proper = 20;

        const char_mappings: { [base: string]: string[] } = {
            A: ["A"],
            C: ["C"],
            G: ["G"],
            T: ["T"],
            U: ["U"],
            M: ["A", "C"],
            R: ["A", "G"],
            S: ["C", "G"],
            W: ["A", "T"],
            Y: ["C", "T"],
            K: ["G", "T"],
            V: ["A", "C", "G"],
            H: ["A", "C", "T"],
            D: ["A", "G", "T"],
            B: ["C", "G", "T"],
            N: ["A", "C", "G", "T"],
            X: ["A", "C", "G", "T"],
        };

        // currently in a gap of the respective sequence?
        let gap_1 = false;
        let gap_2 = false;
        // how many proper characters have been seen currently
        let proper_1 = 0;
        let proper_2 = 0;

        // run over each position of the alignment
        for (let i = 0; i < alignment[0].length; i++) {
            let char_1 = alignment[0][i];
            let char_2 = alignment[1][i];

            // #############################################
            // skip the position under these circumstances

            // just ignore positions where there is an N
            if (char_1 == "N" || char_2 == "N") {
                continue;
            }

            // proper chars

            // add 1 if not gap
            proper_1 += char_1 != "-" ? 1 : 0;
            proper_2 += char_2 != "-" ? 1 : 0;

            if (
                // seq 1
                proper_1 < skip_proper || // skip the first x proper characters
                proper_total_1 - proper_1 < skip_proper || // skip the last x proper characters
                // seq 2
                proper_2 < skip_proper || // skip the first x proper characters
                proper_total_2 - proper_2 < skip_proper // skip the last x proper characters
            ) {
                continue;
            }

            // #############################################
            // when the characters are the same go to next pos (match)
            if (char_1 == char_2) {
                continue;
            }

            // #############################################
            // if there is no gap at this pos
            if (char_1 != "-" && char_2 != "-") {
                // if one char maps to the other continue to next pos
                if (char_mappings[char_1].includes(char_2) || char_mappings[char_2].includes(char_1)) {
                    // otherwise increase distance
                } else {
                    // console.log(i, "missmatch", char_1, char_2);
                    distance += 1;
                }

                // no gap currently
                gap_1 = false;
                gap_2 = false;

                // #############################################
                // gap in seq 1
            } else if (char_1 == "-") {
                // if first gap position
                if (!gap_1) {
                    // console.log(i, "gap", char_1, char_2);
                    distance += 1;
                }

                // gap in seq 1 ongoing // evtl reicht hier eine gap-variable
                gap_1 = true;
                gap_2 = false;

                // #############################################
                // gap in seq2
            } else if (char_2 == "-") {
                // if first gap position
                if (!gap_2) {
                    // console.log(i, "gap", char_1, char_2);
                    distance += 1;
                }

                // gap in seq 2 ongoing
                gap_1 = false;
                gap_2 = true;
            }
        }
        return distance;
    };
}
