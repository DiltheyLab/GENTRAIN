import { getRegisteredAtTimestamps, getUniqueClusters } from "../../helpers/graphs";
import { OutbreakSchema } from "../../models/outbreaks";
import { CustomNode } from "../../types/graph";
import { ColorMapGeneratorStrategy } from "./ColorMapGeneratorStrategy";

export class NodeColorMapGenerator extends ColorMapGeneratorStrategy {
    private nodes: CustomNode[];
    constructor(nodes: CustomNode[], selectedOutbreak?: OutbreakSchema) {
        super(selectedOutbreak);
        this.nodes = nodes;
    }

    public createColorMapForTimeSpan = () => {
        const registeredAtTimestamps = getRegisteredAtTimestamps(this.nodes);
        for (let i = 0; i < registeredAtTimestamps.length; i++) {
            const normalizedIndex = i / registeredAtTimestamps.length;
            this.colorMap[registeredAtTimestamps[i]] = { color: this.createColorGradient(normalizedIndex) };
        }
        return this.colorMap;
    };

    private createColorGradient = (normalizedIndex: number): string => {
        // Interpolate hue from 70 (yellow-green) to 0 (red)
        const hue = 70 - normalizedIndex * 70;
        // Use fixed saturation and lightness values
        return `hsl(${hue}, 100%, 50%)`;
    };

    protected getUniqueClusters = (): void => {
        this.clusters = getUniqueClusters(this.nodes);
    };
}
