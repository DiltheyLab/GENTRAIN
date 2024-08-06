import { referenceString } from "@/data/referenceString";
import { SampleSchema } from "@/database/samples";
import { DistanceCalculationStrategy } from "./DistanceCalculationStrategy";
import {
    addAmbiguousMutations,
    addDeletionMutations,
    addInsertionMutations,
    addSubstitutionMutations,
} from "@/services/positions";

export class ViralDistanceCalculation extends DistanceCalculationStrategy {
    calculateSampleDistance = async (sample1: SampleSchema, sample2: SampleSchema) => {
        // create pseudoalignment
        let alignment = await this.alignSamples(sample1, sample2);
        // count of proper characters per sequence (so that in the beginning and end the first/last x chars can be skipped)
        let proper_total_1 = (sample1.sequence_length ?? 0) - (sample1.n_count ?? 0);
        let proper_total_2 = (sample2.sequence_length ?? 0) - (sample2.n_count ?? 0);

        // find all differences
        let distance = this.countDifferences(alignment, proper_total_1, proper_total_2);

        return distance;
    };

    alignSamples = async (sample1: SampleSchema, sample2: SampleSchema) => {
        console.time("positions");
        const positionsSample1 = this.getMutationPositions(sample1);
        const positionsSample2 = this.getMutationPositions(sample2);
        console.timeEnd("positions");
        const positions: {
            [position: number]: {
                hasDeletion: boolean;
                insertionIndex: number | null;
                mutations: { type: string; characters: string }[];
            };
        }[] = [positionsSample1, positionsSample2];
        let alignment = ["", ""];
        for (let baseIndex = 0; baseIndex < referenceString.length; baseIndex++) {
            const refChar = referenceString[baseIndex];
            let additions = ["", ""];
            for (const index in positions) {
                const position = positions[index][baseIndex];
                const sequenceIndex = parseInt(index);
                const otherSequenceIndex = sequenceIndex === 0 ? 1 : 0;
                if (this.hasNoMutationsAtPosition(position)) {
                    additions[sequenceIndex] = refChar; // evtl +additions[sequenceIndex]
                    continue;
                }
                const mutations = position.mutations;
                for (const mutation of mutations) {
                    additions[sequenceIndex] = this.handleSnp(mutation, additions[sequenceIndex]);
                    if (!this.sequenceHasDeletionAtPosition(otherSequenceIndex, baseIndex, positions)) {
                        additions[sequenceIndex] = this.handleDeletion(mutation, additions[sequenceIndex]);
                    }
                }
            }
            additions = await this.handleInsertions(baseIndex, positions, additions);
            alignment[0] += additions[0];
            alignment[1] += additions[1];
        }
        return alignment;
    };

    hasNoMutationsAtPosition = (position: {
        hasDeletion: boolean;
        insertionIndex: number | null;
        mutations: { type: string; characters: string }[];
    }) => {
        if (typeof position === "undefined") {
            return true;
        }
    };

    handleSnp = (mutation: { type: string; characters: string }, additions: string) => {
        if (mutation.type === "snp") {
            additions += mutation.characters;
        }
        return additions;
    };

    handleDeletion = (mutation: { type: string; characters: string }, additions: string) => {
        if (mutation["type"] == "del") {
            additions += mutation["characters"];
        }
        return additions;
    };
    handleInsertions = async (
        baseIndex: number,
        positions: {
            [position: number]: {
                hasDeletion: boolean;
                insertionIndex: number | null;
                mutations: { type: string; characters: string }[];
            };
        }[],
        additions: string[]
    ) => {
        const firstSequenceInsertionIndex = this.getInsertionIndexForSequenceAtPosition(0, baseIndex, positions);
        const secondSequenceInsertionIndex = this.getInsertionIndexForSequenceAtPosition(1, baseIndex, positions);
        let charactersToInsert1 = "";
        let charactersToInsert2 = "";
        if (firstSequenceInsertionIndex && secondSequenceInsertionIndex) {
            charactersToInsert1 = positions[0][baseIndex].mutations[firstSequenceInsertionIndex].characters;
            charactersToInsert2 = positions[1][baseIndex].mutations[secondSequenceInsertionIndex].characters;
            if (charactersToInsert1 !== charactersToInsert2) {
                [charactersToInsert1, charactersToInsert2] = await this.alignInsertions(
                    charactersToInsert1,
                    charactersToInsert2
                );
            }
            additions[0] += charactersToInsert1;
            additions[1] += charactersToInsert2;
        }
        if (firstSequenceInsertionIndex && !secondSequenceInsertionIndex) {
            charactersToInsert1 = positions[0][baseIndex].mutations[firstSequenceInsertionIndex].characters;
            charactersToInsert2 = new Array(charactersToInsert1.length + 1).join("-");
        }
        if (!firstSequenceInsertionIndex && secondSequenceInsertionIndex) {
            charactersToInsert2 = positions[1][baseIndex].mutations[secondSequenceInsertionIndex].characters;
            charactersToInsert1 = new Array(charactersToInsert2.length + 1).join("-");
        }
        additions[0] += charactersToInsert1;
        additions[1] += charactersToInsert2;
        return additions;
    };

    sequenceHasDeletionAtPosition = (
        sequenceIndex: number,
        baseIndex: number,
        positions: {
            [position: number]: {
                hasDeletion: boolean;
                insertionIndex: number | null;
                mutations: { type: string; characters: string }[];
            };
        }[]
    ) => {
        return positions[sequenceIndex][baseIndex] && positions[sequenceIndex][baseIndex].hasDeletion;
    };

    getInsertionIndexForSequenceAtPosition = (
        sequenceIndex: number,
        baseIndex: number,
        positions: {
            [position: number]: {
                hasDeletion: boolean;
                insertionIndex: number | null;
                mutations: { type: string; characters: string }[];
            };
        }[]
    ) => {
        return positions[sequenceIndex][baseIndex] && positions[sequenceIndex][baseIndex].insertionIndex;
    };

    alignInsertions = async (insertion1: string, insertion2: string) => {
        const fasta_string = `>1\n${insertion1}\n>2\n${insertion2}`;
        let result = await this.cli.mount({
            name: "distance_input.fa",
            data: fasta_string,
        });
        result = await this.cli.exec("kalign distance_input.fa -f fasta -o distance_result.fasta");
        result = await this.cli.cat("distance_result.fasta");
        result = result.split(/[\r\n]+/);
        return [result[1], result[3]];
    };

    alignSamplesOld = async (sample1: SampleSchema, sample2: SampleSchema) => {
        // add bases into here
        let alignment = ["", ""];

        // get dict of position to mutation
        let positions_s1 = this.getMutationPositions(sample1);
        let positions_s2 = this.getMutationPositions(sample2);
        let positions = [positions_s1, positions_s2];

        // check all mutations for every position on the reference string
        // and add the correct bases to the alignment
        for (let i = 0; i < referenceString.length; i++) {
            // added if no mutation or only insertion
            let ref_char = referenceString[i];

            // will be added to alignment after all mutations have been looked at
            let add_chars = ["", ""];

            // for both sequences
            for (let idx_seq = 0; idx_seq < 2; idx_seq++) {
                // if there is no mutation add refchar and continue
                if (typeof positions[idx_seq][i] === "undefined") {
                    add_chars[idx_seq] = ref_char + add_chars[idx_seq];
                    continue;
                }

                //  for every mutation of this sequence (should be max 2)
                for (let idx_mut = 0; idx_mut < positions[idx_seq][i].length; idx_mut++) {
                    // current mutation
                    let mutation = positions[idx_seq][i][idx_mut];

                    // ############################################################
                    // point mutations or ambig chars
                    // just add mutation to add_chars
                    if (mutation["type"] == "snp") {
                        add_chars[idx_seq] += mutation["replacement"];
                    }

                    // ############################################################
                    // deletions (includes alignment start and end)
                    // either add nothing (del on both seqs) or add "-"

                    if (mutation["type"] == "del") {
                        // was a deletion found in the other sequence
                        let found = false;

                        // if already second seq then was not in first (and second seq has mutations at this pos)
                        if (idx_seq == 0 && !(typeof positions[idx_seq + 1][i] === "undefined")) {
                            // for every mutaion on the second seq
                            for (let idx_mut_2 = 0; idx_mut_2 < positions[idx_seq + 1][i].length; idx_mut_2++) {
                                let mutation_2 = positions[idx_seq + 1][i][idx_mut_2];

                                // if seq 2 also has the same del then addchars should stay ""
                                if ((mutation_2["type"] = "del")) {
                                    // report that it was found
                                    found = true;
                                    // remove from the other list so it wont come up again
                                    positions[idx_seq + 1][i].splice(idx_mut_2, 1);
                                    break;
                                }
                            }
                        }

                        // if the deletion was only in one sequence add the "-"
                        if (!found) {
                            add_chars[idx_seq] += mutation["replacement"];
                        }
                    }

                    // ############################################################
                    // insertions
                    // either add ins and "-" to other seq or align two ins with kalign

                    if (mutation["type"] == "ins") {
                        // was a insertion found in the other sequence
                        let found = false;

                        // if already second seq then was not in first (and second seq has mutations at this pos)
                        if (idx_seq == 0 && !(typeof positions[idx_seq + 1][i] === "undefined")) {
                            // for every mutaion on the second seq
                            for (let idx_mut_2 = 0; idx_mut_2 < positions[idx_seq + 1][i].length; idx_mut_2++) {
                                let mutation_2 = positions[idx_seq + 1][i][idx_mut_2];

                                // if seq 2 also has an insertion align them with kalign
                                if (mutation_2["type"] == "ins") {
                                    // report that it was found
                                    found = true;
                                    // put insertions into fasta string
                                    const fasta_string = `>1\n${mutation["replacement"]}\n>2\n${mutation_2["replacement"]}`;
                                    // mount fasta string as file
                                    let result = await this.cli.mount({
                                        name: "distance_input.fa",
                                        data: fasta_string,
                                    });

                                    result = await this.cli.exec(
                                        "kalign distance_input.fa -f fasta -o distance_result.fasta"
                                    );

                                    // fetch FASTA file output
                                    result = await this.cli.cat("distance_result.fasta");
                                    // console.log("result:");
                                    // console.log(result);
                                    // split by newline
                                    result = result.split(/[\r\n]+/);

                                    // Add to current sequence (should be sequence 0)

                                    // there is another mutation on this sequence
                                    if (positions[idx_seq][i].length > 1) {
                                        add_chars[idx_seq] += result[1];
                                        // no other mutation -> add ref char
                                    } else {
                                        add_chars[idx_seq] = ref_char + add_chars[idx_seq] + result[1];
                                    }

                                    // Add to other sequence (should be sequence 1)

                                    // there is another mutation on this sequence
                                    if (positions[1 - idx_seq][i].length > 1) {
                                        add_chars[1 - idx_seq] += result[3];
                                        // no other mutation -> add ref char
                                    } else {
                                        add_chars[1 - idx_seq] = ref_char + add_chars[1 - idx_seq] + result[3];
                                    }

                                    // remove from the other list so it wont come up again
                                    positions[idx_seq + 1][i].splice(idx_mut_2, 1);
                                    break;
                                }
                            }
                        }

                        // if it is the only insertion at this position
                        if (!found) {
                            // there is another mutation on this sequence
                            if (positions[idx_seq][i].length > 1) {
                                add_chars[idx_seq] += mutation["replacement"];
                                // no other mutation -> add ref char
                            } else {
                                add_chars[idx_seq] = ref_char + add_chars[idx_seq] + mutation["replacement"]; // evtl add_chars nicht notwendig
                            }
                            // add multiple "-" to the other sequence
                            add_chars[1 - idx_seq] += new Array(mutation["replacement"].length + 1).join("-");
                        }
                    }
                }
            }

            // after going through all mutations at a position add them to the alignment
            alignment[0] += add_chars[0];
            alignment[1] += add_chars[1];
        }

        return alignment;
    };

    getMutationPositions(sample: SampleSchema) {
        if (!sample.variants) {
            return {};
        }
        let mutationPositions: any = {};

        mutationPositions = addInsertionMutations(sample, mutationPositions);
        mutationPositions = addSubstitutionMutations(sample, mutationPositions);
        mutationPositions = addAmbiguousMutations(sample, mutationPositions);
        mutationPositions = addDeletionMutations(sample, mutationPositions);

        return mutationPositions;
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
