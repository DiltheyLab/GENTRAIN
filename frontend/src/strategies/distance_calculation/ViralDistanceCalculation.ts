import { referenceString } from "@/data/referenceString";
import { SampleSchema } from "@/database/samples";
import { useSampleUploadStore } from "@/stores/upload";
import { db } from "@/database/db";
import { DistancesSchema } from "@/database/distances";
import { DistanceCalculationStrategy } from "./DistanceCalculationStrategy";

export class ViralDistanceCalculation extends DistanceCalculationStrategy {
    constructor() {
        super();
    }

    calculateSampleDistances = async () => {
        for (const index in this.samples) {
            const sample1 = this.samples[index];
            // we only calculate distances between current sample and previously iterated samples to minimize calculation count
            // as limit we use the index of the current sample incremented by 1 since slice excludes the end index
            const previousSamples = this.samples.slice(0, parseInt(index));
            for (const sample2 of previousSamples) {
                const distance = await this.calculateSampleDistance(sample1, sample2);

                await db.distances.add({
                    sample_id_1: sample1.id,
                    sample_id_2: sample2.id,
                    value: distance,
                    distance_matrix_id: this.distanceMatrixId,
                } as DistancesSchema);
                useSampleUploadStore.getState().incrementDistanceCalculationCount();
            }
        }
    };

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
        // add bases into here
        let alignment = ["", ""];

        // get dict of position to mutation
        let positions_s1 = this.getLetiantPositions(sample1);
        let positions_s2 = this.getLetiantPositions(sample2);
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
                        add_chars[idx_seq] += mutation["mut"];
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
                            add_chars[idx_seq] += mutation["mut"];
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
                                if ((mutation_2["type"] = "ins")) {
                                    // report that it was found
                                    found = true;

                                    // put insertions into fasta string
                                    const fasta_string = `>1\n${mutation["mut"]}\n>2\n${mutation_2["mut"]}`;
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
                                add_chars[idx_seq] += mutation["mut"];
                                // no other mutation -> add ref char
                            } else {
                                add_chars[idx_seq] = ref_char + add_chars[idx_seq] + mutation["mut"];
                            }
                            // add multiple "-" to the other sequence
                            add_chars[1 - idx_seq] += new Array(mutation["mut"].length + 1).join("-");
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

    getLetiantPositions(sample: SampleSchema) {
        if (!sample.variants) {
            return {};
        }
        let positions: any = {};
        let info;

        // Deletions
        for (const i in sample.variants["deletions"]) {
            let letiant = sample.variants["deletions"][i];
            let start = letiant["start"];
            let len = letiant["length"];

            // add each position of a deletion on its own
            for (let j = start; j < start + len; j++) {
                info = {
                    type: "del",
                    mut: "-",
                };
                j in positions ? positions[j].push(info) : (positions[j] = [info]);
            }
        }

        // Insertions
        for (const i in sample.variants["insertions"]) {
            let letiant = sample.variants["insertions"][i];
            let pos = letiant["pos"];

            info = {
                type: "ins",
                mut: letiant["ins"],
            };
            pos in positions ? positions[pos].push(info) : (positions[pos] = [info]);
        }

        // Substitutions
        for (const i in sample.variants["substitutions"]) {
            // { refNuc: "C", pos: 240, queryNuc: "T", … }
            let letiant = sample.variants["substitutions"][i];
            let pos = letiant["pos"];

            info = {
                type: "snp",
                mut: letiant["queryNuc"],
            };
            pos in positions ? positions[pos].push(info) : (positions[pos] = [info]);
        }

        // Ns
        for (const i in sample.variants["missing"]) {
            // { begin: 28881, end: 28883, character: "N" }
            let letiant = sample.variants["missing"][i];
            let start = letiant["begin"];
            let end = letiant["end"];
            let char = letiant["character"];

            // add each position of a N block separately
            for (let j = start; j < end; j++) {
                info = {
                    type: "snp",
                    mut: char,
                };
                j in positions ? positions[j].push(info) : (positions[j] = [info]);
            }
        }

        // other ambious characters
        for (const i in sample.variants["nonACGTNs"]) {
            // { begin: 60, end: 61, character: "Y" }
            let letiant = sample.variants["nonACGTNs"][i];
            let start = letiant["begin"];
            let end = letiant["end"];
            let char = letiant["character"];

            // add each position of a ambig char block separately
            for (let j = start; j < end; j++) {
                info = {
                    type: "snp",
                    mut: char,
                };
                j in positions ? positions[j].push(info) : (positions[j] = [info]);
            }
        }

        // Start of alignment
        for (let i = 0; i < sample.variants["alignmentStart"]; i++) {
            // add dels until sequence starts
            info = {
                type: "del",
                mut: "-",
            };
            i in positions ? positions[i].push(info) : (positions[i] = [info]);
        }

        // End of alignment
        for (let i = sample.variants["alignmentEnd"]; i < referenceString.length; i++) {
            // add dels until reference sequence ends
            info = {
                type: "del",
                mut: "-",
            };
            i in positions ? positions[i].push(info) : (positions[i] = [info]);
        }

        return positions;
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

                // gap in seq 1 ongoing
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
