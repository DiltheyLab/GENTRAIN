import { referenceString } from "@/data/referenceString";
import { SampleSchema } from "@/database/samples";

export const addInsertionMutations = (
    sample: SampleSchema,
    positions: {
        [position: number]: { type: string; characters: string }[];
    }
) => {
    if (!sample.variants) {
        return;
    }
    for (const mutation of sample.variants["insertions"]) {
        positions = addInsertionToPositions(mutation["ins"], mutation["pos"], positions);
    }
    return positions;
};

export const addSubstitutionMutations = (
    sample: SampleSchema,
    positions: {
        [position: number]: { type: string; characters: string }[];
    }
) => {
    if (!sample.variants) {
        return;
    }
    for (const mutation of sample.variants["substitutions"]) {
        positions = addSubstitutionToPositions(mutation["queryNuc"], mutation["pos"], positions);
    }
    return positions;
};

export const addAmbiguousMutations = (
    sample: SampleSchema,
    positions: {
        [position: number]: { type: string; characters: string }[];
    }
) => {
    if (!sample.variants) {
        return;
    }
    // Ns
    for (const mutation of sample.variants["missing"]) {
        // { begin: 28881, end: 28883, character: "N" }
        let start = mutation["begin"];
        let end = mutation["end"];
        let char = mutation["character"];

        // add each position of a N block separately
        for (let j = start; j < end; j++) {
            positions = addSubstitutionToPositions(char, j, positions);
        }
    }

    // other ambious characters
    for (const mutation of sample.variants["nonACGTNs"]) {
        // { begin: 60, end: 61, character: "Y" }
        let start = mutation["begin"];
        let end = mutation["end"];
        let char = mutation["character"];

        // add each position of a ambig char block separately
        for (let j = start; j < end; j++) {
            positions = addSubstitutionToPositions(char, j, positions);
        }
    }
    return positions;
};

export const addDeletionMutations = (
    sample: SampleSchema,
    positions: {
        [position: number]: { type: string; characters: string }[];
    }
) => {
    if (!sample.variants) {
        return;
    }
    // Deletions
    for (const mutation of sample.variants["deletions"]) {
        let start = mutation["start"];
        let len = mutation["length"];

        // add each position of a deletion on its own
        for (let j = start; j < start + len; j++) {
            positions = addDeletionToPositions(j, positions);
        }
    }

    // Start of alignment
    for (let i = 0; i < sample.variants["alignmentStart"]; i++) {
        positions = addDeletionToPositions(i, positions);
    }

    // End of alignment
    for (let i = sample.variants["alignmentEnd"]; i < referenceString.length; i++) {
        positions = addDeletionToPositions(i, positions);
    }
    return positions;
};

export const addSubstitutionToPositions = (
    character: string,
    position: number,
    positions: {
        [position: number]: { type: string; characters: string }[];
    }
) => {
    return includeMutationInPositionsArray(
        {
            type: "snp",
            characters: character,
        },
        position,
        positions
    );
};

export const addInsertionToPositions = (
    character: string,
    position: number,
    positions: {
        [position: number]: { type: string; characters: string }[];
    }
) => {
    return includeMutationInPositionsArray(
        {
            type: "ins",
            characters: character,
        },
        position,
        positions
    );
};

export const addDeletionToPositions = (
    position: number,
    positions: {
        [position: number]: { type: string; characters: string }[];
    }
) => {
    return includeMutationInPositionsArray(
        {
            type: "del",
            characters: "-",
        },
        position,
        positions
    );
};

export const includeMutationInPositionsArray = (
    mutation: { type: string; characters: string },
    position: number,
    positions: {
        [position: number]: { type: string; characters: string }[];
    }
) => {
    if (position in positions) {
        positions[position].push({ type: mutation.type, characters: mutation.characters });
    } else {
        positions[position] = [{ type: mutation.type, characters: mutation.characters }];
    }
    return positions;
};
