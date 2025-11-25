import { sha256 } from "js-sha256";
import { PathogenStrategyManager } from "../../pathogen_strategies/PathogenStrategyManager";

onmessage = async (e) => {
    const data = e.data.sequences;
    const sequenceImports = {};
    // We can not use Zustand states from within the worker file
    // so we use a static strategy retrieval method intead
    const strategy = PathogenStrategyManager.getSequenceAnalysisStrategyWithoutZustand(e.data.activePathogen)
    for (const item of data) {
        const hash = sha256(item.sequence);

        if (sequenceImports[hash]) {
            sequenceImports[hash].fasta_ids.push(item.fastaId);
        } else {
            sequenceImports[hash] = {
                fasta_ids: [item.fastaId],
                sequence: item.sequence,
                status: "pending",
                ...strategy.getQualityParameters(item.sequence),
            };
        }
    }
    postMessage(sequenceImports);
};