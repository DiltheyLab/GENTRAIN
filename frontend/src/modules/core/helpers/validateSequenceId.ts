import { CaseSchema } from "../models/cases";

export const validateSequenceId = (entities: CaseSchema[] | undefined, fasta_id: string) => {
    const isUniqueSequenceId = () => {
        return entities?.find((entity) => entity.fasta_id === fasta_id) === undefined;
    };

    const sequenceIdPatternIsValid = () => {
        if (fasta_id === "") return true;
        const pattern = /^[A-Za-z0-9-_.]+$/;
        return pattern.test(fasta_id);
    };

    const isSequenceIdValid = () => {
        return sequenceIdPatternIsValid() && isUniqueSequenceId();
    };

    return { isUniqueSequenceId, sequenceIdPatternIsValid, isSequenceIdValid };
};
