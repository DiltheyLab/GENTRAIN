import { getUniqueClusterOfCases } from "../../helpers/graphs";
import { CaseWithRelationships } from "../../models/cases";
import { OutbreakSchema } from "../../models/outbreaks";
import { ColorMapGenerator } from "./ColorMapGenerator";

export class CaseColorMapGenerator extends ColorMapGenerator {
    private cases: CaseWithRelationships[];
    constructor(cases: CaseWithRelationships[], selectedOutbreak?: OutbreakSchema) {
        super(selectedOutbreak);
        this.cases = cases;
    }

    protected getUniqueClusters = (): void => {
        this.clusters = getUniqueClusterOfCases(this.cases);
    };
}
