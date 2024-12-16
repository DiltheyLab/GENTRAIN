import { referenceString } from "@/data/referenceString";
import { ViralAnalysisResult } from "@/modules/core/models/sequence_analyses";

export interface MutationsSchema {
    [type: string]: string;
}
export interface PositionsSchema {
    [position: number]: MutationsSchema;
}

export class ViralPositionExtractor {
    protected sequenceAnalysisResult: ViralAnalysisResult;
    protected positions: PositionsSchema;

    constructor(sequenceAnalysisResult: ViralAnalysisResult) {
        this.sequenceAnalysisResult = sequenceAnalysisResult;
        this.positions = {};
    }

    public collectPositions = () => {
        this.addInsertionMutations();
        this.addSubstitutionMutations();
        this.addAmbiguousMutations();
        this.addDeletionMutations();
    };

    public getPositions = () => {
        return this.positions;
    };

    private addInsertionMutations = () => {
        if (!this.sequenceAnalysisResult.mutations) {
            return;
        }
        for (const mutation of this.sequenceAnalysisResult.mutations["insertions"]) {
            // insertions can precede the reference genome if the genome is not treated as a whole
            if (mutation["pos"] < 0) {
                continue;
            }
            this.addInsertionToPositions(mutation["ins"], mutation["pos"]);
        }
    };

    private addSubstitutionMutations = () => {
        if (!this.sequenceAnalysisResult.mutations) {
            return;
        }
        for (const mutation of this.sequenceAnalysisResult.mutations["substitutions"]) {
            this.addSubstitutionToPositions(mutation["qryNuc"], mutation["pos"]);
        }
    };

    private addAmbiguousMutations = () => {
        if (!this.sequenceAnalysisResult.mutations) {
            return;
        }
        // Ns
        for (const mutation of this.sequenceAnalysisResult.mutations["missing"]) {
            // { begin: 28881, end: 28883, character: "N" }
            let start = mutation["range"]["begin"];
            let end = mutation["range"]["end"];
            let char = mutation["character"];

            // add each position of a N block separately
            for (let j = start; j < end; j++) {
                this.addSubstitutionToPositions(char, j);
            }
        }

        // other ambious characters
        for (const mutation of this.sequenceAnalysisResult.mutations["nonACGTNs"]) {
            // { begin: 60, end: 61, character: "Y" }
            let start = mutation["range"]["begin"];
            let end = mutation["range"]["end"];
            let char = mutation["character"];

            // add each position of a ambig char block separately
            for (let j = start; j < end; j++) {
                this.addSubstitutionToPositions(char, j);
            }
        }
    };

    private addDeletionMutations = () => {
        if (!this.sequenceAnalysisResult.mutations) {
            return;
        }
        // Deletions
        for (const mutation of this.sequenceAnalysisResult.mutations["deletions"]) {
            let start = mutation["range"]["begin"];
            let end = mutation["range"]["end"];

            // add each position of a deletion on its own
            for (let j = start; j < end; j++) {
                this.addDeletionToPositions(j);
            }
        }

        // Start of alignment
        for (let i = 0; i < this.sequenceAnalysisResult.mutations["alignmentRange"]["begin"]; i++) {
            this.addDeletionToPositions(i);
        }

        // End of alignment
        for (let i = this.sequenceAnalysisResult.mutations["alignmentRange"]["end"]; i < referenceString.length; i++) {
            this.addDeletionToPositions(i);
        }
    };

    private addSubstitutionToPositions = (character: string, position: number) => {
        this.includeMutationInPositionsArray(
            {
                type: "snp",
                characters: character,
            },
            position
        );
    };

    private addInsertionToPositions = (character: string, position: number) => {
        this.includeMutationInPositionsArray(
            {
                type: "ins",
                characters: character,
            },
            position
        );
    };

    private addDeletionToPositions = (position: number) => {
        this.includeMutationInPositionsArray(
            {
                type: "del",
                characters: "-",
            },
            position
        );
    };

    private includeMutationInPositionsArray = (mutation: { type: string; characters: string }, position: number) => {
        if (!(position in this.positions)) {
            this.positions[position] = {};
        }
        this.positions[position][mutation.type] = mutation.characters;
    };
}
