import { SampleSchema } from "@/database/samples";

export const getVariantsForSequence = async (
    sequence: string
): Promise<{ lineage: string; n_count: number; variants: object }> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/data/nextclade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fasta_content: `>0\n${sequence}` }),
    });
    let result = await response.json();
    result = result.results[0];

    return {
        lineage: `${result["clade"]}, ${result["customNodeAttributes"]["Nextclade_pango"]}`,
        n_count: result["totalMissing"],
        variants: {
            substitutions: result["substitutions"],
            deletions: result["deletions"],
            insertions: result["insertions"],
            missing: result["missing"],
            nonACGTNs: result["nonACGTNs"],
            alignmentStart: result["alignmentStart"],
            alignmentEnd: result["alignmentEnd"],
        },
    };
};

export function samplesByFastaId(samples: SampleSchema[]) {
    var samples_dict: { [fastaId: string]: SampleSchema } = {};
    for (const sample of samples) {
        samples_dict[sample.fasta_id] = sample;
    }
    return samples_dict;
}
{
}
