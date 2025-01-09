import { SampleSchema } from "@/modules/core/models/samples";

const ambiguousChars: { [base: string]: string[] } = {
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

export class ViralDistanceExtractor {
    protected sample1: SampleSchema;
    protected sample2: SampleSchema;
    protected properThreshold: number;
    protected distance: number = 0;
    protected activeGap1: boolean = false;
    protected activeGap2: boolean = false;
    protected properCharAmount1: number;
    protected properCharAmount2: number;
    protected properCharsSeen1: number = 0;
    protected properCharsSeen2: number = 0;
    protected currentChar1: string = "";
    protected currentChar2: string = "";

    constructor(sample1: SampleSchema, sample2: SampleSchema, properThreshold: number = 20) {
        this.sample1 = sample1;
        this.sample2 = sample2;
        this.properThreshold = properThreshold;
        this.properCharAmount1 = (sample1.sequence_length ?? 0) - (sample1.n_count ?? 0);
        this.properCharAmount2 = (sample2.sequence_length ?? 0) - (sample2.n_count ?? 0);
    }

    public getDistance = () => {
        return this.distance;
    };

    public calculateDistance = (sequence1: string, sequence2: string) => {
        console.log(sequence1, sequence2);
        for (let i = 0; i < sequence1.length; i++) {
            this.currentChar1 = sequence1[i];
            this.currentChar2 = sequence2[i];
            if (this.atleastOneCharIsN()) {
                continue;
            }

            this.incrementProperCharsSeen();

            if (this.properThresholdNotReached() || this.charsAreEqual()) {
                continue;
            }

            this.incrementDistanceOnGaps();

            this.incrementDistanceForDifferingChars();
        }
    };

    private incrementProperCharsSeen = () => {
        this.properCharsSeen1 += this.currentChar1 !== "-" ? 1 : 0;
        this.properCharsSeen2 += this.currentChar2 !== "-" ? 1 : 0;
    };

    private properThresholdNotReached = () => {
        return (
            this.properCharsSeen1 < this.properThreshold ||
            this.properCharAmount1 - this.properCharsSeen1 < this.properThreshold ||
            this.properCharsSeen2 < this.properThreshold ||
            this.properCharAmount2 - this.properCharsSeen2 < this.properThreshold
        );
    };

    private charsAreEqual = () => {
        return this.currentChar1 === this.currentChar2;
    };

    private incrementDistanceOnGaps = () => {
        if (this.currentChar1 === "-") {
            if (!this.activeGap1) {
                this.distance += 1;
            }
            this.activeGap1 = true;
            this.activeGap2 = false;
        }

        if (this.currentChar2 === "-") {
            if (!this.activeGap2) {
                this.distance += 1;
            }
            this.activeGap1 = false;
            this.activeGap2 = true;
        }
    };

    private incrementDistanceForDifferingChars = () => {
        if (this.bothCharsAreNoGap() && !this.ambiguousCharsOverlap()) {
            this.distance += 1;
            this.activeGap1 = false;
            this.activeGap2 = false;
        }
    };

    private ambiguousCharsOverlap = () => {
        return (
            ambiguousChars[this.currentChar1].includes(this.currentChar2) ||
            ambiguousChars[this.currentChar2].includes(this.currentChar1)
        );
    };

    private atleastOneCharIsN = () => {
        return this.currentChar1 === "N" || this.currentChar2 === "N";
    };

    private bothCharsAreNoGap = () => {
        return this.currentChar1 !== "-" && this.currentChar2 !== "-";
    };
}
