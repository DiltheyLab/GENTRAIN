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
