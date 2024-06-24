
// #################################################
// #             Distance calculations             #
// #################################################


// ################################
// #   update matrix on upload    #
// ################################


/**
 * Update the distance matrix structure and calculate all needed distances
 * @param {array} fastaids_added  list of fasta_ids to be added
 * @param {array} fastaids_removed list of fasta_ids to be removed
 * @returns  TODO
 */
async function calculate_updated_distancematrix(fastaids_added, fastaids_removed) {
    // collect data from db
    samples = await DB.get_samples();
    samples_dict = samples_by_sampleid(samples);
    dm = await DB.get_dm();

    // load kalign
    const CLI = await new Aioli(["kalign/3.3.1"]);


    // get row/column names and matrix
    if (dm.length > 0) {
        row_column_names = dm[0]["row_column_names"];
        matrix = dm[0]["matrix"];
    } else {
        row_column_names = [];
        matrix = [];
    }

    // first of remove unwanted fastaids and corresponding distances
    for (var indx in fastaids_removed) {
        rem_index = row_column_names.indexOf(fastaids_removed[indx]);
        if (rem_index != -1) {
            // remove from row_column_names
            row_column_names.splice(rem_index, 1);
            // remove row from matrix
            matrix.splice(rem_index, 1);
            // remove column from matrix
            for (var i in matrix) {
                // for (var j in matrix[0]) {
                matrix[i].splice(rem_index, 1);
                // }
            }
        }
    }

    // then add new samples to dm and calculate their distances
    for (var indx in fastaids_added) {
        fasta_id = fastaids_added[indx];

        // when fasta id already in dm then overwrite it, otherwise add as last entry
        add_index = row_column_names.indexOf(fasta_id);
        if (add_index == -1) {

            matrix.push(new Array(row_column_names.length).fill(-1));
            for (var i in matrix) {
                matrix[i].push(-1);
            }

            row_column_names.push(fasta_id);
            add_index = row_column_names.length - 1;
        }

        // overwrite distances
        for (var i in matrix) {
            // skip the diagonal (distance to itself stays -1)
            if (i == add_index) {
                continue;
            }

            // distance calculation (+ pseudo alignment)
            dist = await calculate_single_distance(samples_dict[fasta_id], samples_dict[row_column_names[i]], CLI);

            // add distance
            matrix[i][add_index] = dist;
            matrix[add_index][i] = dist;

        }

    }


    // collect data and update database
    dm_data = {
        id: "dm_full",
        row_column_names: row_column_names,
        matrix: matrix,
        edit_timestamp: new Date()
    };

    // update
    var response = await DB.update_dm(dm_data)
    console.log(response);

    // TODO
    return true;
}



// ################################
// # single distance calculation  #
// ################################


/**
 * Calculate the genetic distance between two samples.
 * Manages workflow: 
 * 1. create pseudo alignment, 
 * 2. check differences 
 * @param {dictionary} sample1 one sample from the DB
 * @param {dictionary} sample2 one sample from the DB
 * @param {object} CLI Used for kalign
 * @returns {int} genetic distance
 */
async function calculate_single_distance(sample1, sample2, CLI) {

    // console.log(sample1["fasta_ID"], sample1["fasta_ID"]);

    // create pseudoalignment
    var alignment = await align_from_nextclade(sample1, sample2, CLI);

    // count of proper characters per sequence (so that in the beginning and end the first/last x chars can be skipped)
    var proper_total_1 = sample1["sequence"].length - sample1["N_count"]
    var proper_total_2 = sample2["sequence"].length - sample2["N_count"]

    // find all differences
    var distance = count_differences(alignment, proper_total_1, proper_total_2);

    return distance;
}
// function calculate_full_distancematrix() {

//     return true;
// }





// // ################################
// // # calc distance from alignment #
// // ################################

/**
 * TODO
 * @param {*} alignment 
 * @returns 
 */
function count_differences(alignment, proper_total_1, proper_total_2) {
    // return val
    var distance = 0;

    // skip this many proper chars in the beginning and end because of sequencing accuracy
    var skip_proper = 20

    // TODO add to global?
    var char_mappings = {
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
    var gap_1 = false;
    var gap_2 = false;
    // how many proper characters have been seen currently
    var proper_1 = 0;
    var proper_2 = 0;

    // run over each position of the alignment
    for (let i = 0; i < alignment[0].length; i++) {
        var char_1 = alignment[0][i];
        var char_2 = alignment[1][i];

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
        if ((char_1 != "-") && (char_2 != "-")) {

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
}









// // ################################
// // #  create pairwise alignment   #
// // ################################

/**
 * Create a pseudoalignment from a list of variants per sample and the reference genome
 * Workflow:
 * 1. collect variants into dict per sample (keys: position, value: list of dicts of mutation)
 * 2. for each position on the reference string check if there are mutations and add according bases to algnment
 * @param {dictionary} sample1 one sample from the DB
 * @param {dictionary} sample2 one sample from the DB
 * @param {object} CLI Used for kalign
 * @returns alignment (list of two strings)
 */
async function align_from_nextclade(sample1, sample2, CLI) {
    // add bases into here
    var alignment = ["", ""];

    // get dict of position to mutation
    var positions_s1 = get_positions_of_variants(sample1);
    var positions_s2 = get_positions_of_variants(sample2);
    var positions = [positions_s1, positions_s2]

    // check all mutations for every position on the reference string
    // and add the correct bases to the alignment
    for (let i = 0; i < reference_string.length; i++) {
        // added if no mutation or only insertion
        var ref_char = reference_string[i]

        // will be added to alignment after all mutations have been looked at
        var add_chars = ["", ""]

        // for both sequences
        for (let idx_seq = 0; idx_seq < 2; idx_seq++) {

            // if there is no mutation add refchar and continue
            if (typeof positions[idx_seq][i] === 'undefined') {
                add_chars[idx_seq] = ref_char + add_chars[idx_seq];
                continue;
            }

            //  for every mutation of this sequence (should be max 2)
            for (let idx_mut = 0; idx_mut < positions[idx_seq][i].length; idx_mut++) {
                // current mutation
                var mutation = positions[idx_seq][i][idx_mut];

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
                    var found = false;

                    // if already second seq then was not in first (and second seq has mutations at this pos)
                    if ((idx_seq == 0) && !(typeof positions[idx_seq + 1][i] === 'undefined')) {
                        // for every mutaion on the second seq
                        for (let idx_mut_2 = 0; idx_mut_2 < positions[idx_seq + 1][i].length; idx_mut_2++) {

                            var mutation_2 = positions[idx_seq + 1][i][idx_mut_2];

                            // if seq 2 also has the same del then addchars should stay ""
                            if (mutation_2["type"] = "del") {
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
                    var found = false;

                    // if already second seq then was not in first (and second seq has mutations at this pos)
                    if ((idx_seq == 0) && !(typeof positions[idx_seq + 1][i] === 'undefined')) {
                        // for every mutaion on the second seq
                        for (let idx_mut_2 = 0; idx_mut_2 < positions[idx_seq + 1][i].length; idx_mut_2++) {

                            var mutation_2 = positions[idx_seq + 1][i][idx_mut_2];

                            // if seq 2 also has an insertion align them with kalign
                            if (mutation_2["type"] = "ins") {
                                // report that it was found
                                found = true;

                                // put insertions into fasta string
                                fasta_string = `>1\n${mutation["mut"]}\n>2\n${mutation_2["mut"]}`;

                                // mount fasta string as file
                                var result = await CLI.mount({
                                    name: "distance_input.fa",
                                    data: fasta_string
                                });

                                // Run kalign  
                                result = await CLI.exec("kalign distance_input.fa -f fasta -o distance_result.fasta");
                                // console.log("align");
                                // console.log(result);

                                // fetch FASTA file output
                                result = await CLI.cat("distance_result.fasta");
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

    // For testing. displays the alignment in a div
    // d3.select("#seq1").html(sample1["sequence"])
    // d3.select("#seq1_id").html(sample1["fasta_ID"] + " " + sample1["sequence"].length)
    // d3.select("#seq2").html(sample2["sequence"])
    // d3.select("#seq2_id").html(sample2["fasta_ID"] + " " + sample2["sequence"].length)
    // d3.select("#align1").html(alignment[0])
    // d3.select("#align2").html(alignment[1])
    // d3.select("#meta").html(alignment[0].length + " " + alignment[1].length)

    // console.log(positions);

    return alignment
}



/**
 * Collect all variants from nextclade of a sample into one dictionary
 * Worklfow: For each type of variation iterate over the mutations and add them to positions
 * Output structure example: 
 * { 
 *      240: [ {type:"del", mut: "-"} ], 
 *      321: [ {type:"ins", mut: "ATT"}, {type:"snp", mut:"T"} ],
 *      ...
 * }
 * @param {dictionary} sample one sample from the DB
 * @returns {dictionary} positions (key: position (int), value: list of mutations)
 */
function get_positions_of_variants(sample) {
    // return val
    var positions = {};

    // Deletions
    for (const i in sample["variants"]["deletions"]) {

        var variant = sample["variants"]["deletions"][i]
        var start = variant["start"];
        var len = variant["length"];

        // add each position of a deletion on its own
        for (let j = start; j < start + len; j++) {
            info = {
                type: "del",
                mut: "-"
            }
            j in positions ? positions[j].push(info) : positions[j] = [info];
        }
    }

    // Insertions
    for (const i in sample["variants"]["insertions"]) {

        var variant = sample["variants"]["insertions"][i]
        var pos = variant["pos"];

        info = {
            type: "ins",
            mut: variant["ins"]
        };
        pos in positions ? positions[pos].push(info) : positions[pos] = [info];

    }

    // Substitutions
    for (const i in sample["variants"]["substitutions"]) {

        // { refNuc: "C", pos: 240, queryNuc: "T", … }
        var variant = sample["variants"]["substitutions"][i]
        var pos = variant["pos"];

        info = {
            type: "snp",
            mut: variant["queryNuc"]
        };
        pos in positions ? positions[pos].push(info) : positions[pos] = [info];
    }

    // Ns
    for (const i in sample["variants"]["missing"]) {

        // { begin: 28881, end: 28883, character: "N" }    
        var variant = sample["variants"]["missing"][i]
        var start = variant["begin"];
        var end = variant["end"];
        var char = variant["character"];

        // add each position of a N block separately
        for (let j = start; j < end; j++) {
            info = {
                type: "snp",
                mut: char
            };
            j in positions ? positions[j].push(info) : positions[j] = [info];

        }

    }

    // other ambious characters
    for (const i in sample["variants"]["nonACGTNs"]) {

        // { begin: 60, end: 61, character: "Y" }
        var variant = sample["variants"]["nonACGTNs"][i]
        var start = variant["begin"];
        var end = variant["end"];
        var char = variant["character"];

        // add each position of a ambig char block separately
        for (let j = start; j < end; j++) {
            info = {
                type: "snp",
                mut: char
            };
            j in positions ? positions[j].push(info) : positions[j] = [info];

        }
    }

    // Start of alignment
    for (let i = 0; i < sample["variants"]["alignmentStart"]; i++) {
        // add dels until sequence starts
        info = {
            type: "del",
            mut: "-"
        };
        i in positions ? positions[i].push(info) : positions[i] = [info];
    }

    // End of alignment
    for (let i = sample["variants"]["alignmentEnd"]; i < reference_string.length; i++) {
        // add dels until reference sequence ends
        info = {
            type: "del",
            mut: "-"
        };
        i in positions ? positions[i].push(info) : positions[i] = [info];
    }

    return positions
}
