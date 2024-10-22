import { CaseWithRelationships } from "@/modules/core/models/cases";
import { SampleSchema } from "@/modules/core/models/samples";

export function getSampleDictionary(samples: SampleSchema[]) {
    const sampleDictionary: { [id: string]: SampleSchema } = {};
    for (const sample of samples) {
        sampleDictionary[sample.id] = sample;
    }
    return sampleDictionary;
}

export function extractSamplesFromCases(cases: CaseWithRelationships[]) {
    const samples: SampleSchema[] = [];
    for (const caseData of cases) {
        if (caseData.sample) {
            samples.push(caseData.sample);
        }
    }
    return samples.sort();
}

export const getSampleStatusColorClassNames = (status: string) => {
    switch (status) {
        case "sent":
            return "text-slate-200 border-slate-200";
        case "enqueued":
            return "text-slate-700 border-slate-700";
        case "started":
            return "text-yellow-600 border-yellow-600";
        case "finished":
            return "text-green-600 border-green-600";
        case "failed":
            return "text-red-600 border-red-600";
        default:
            return "";
    }
};
