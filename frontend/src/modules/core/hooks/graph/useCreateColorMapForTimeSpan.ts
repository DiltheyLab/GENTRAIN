import { createColorMapForTimeSpan } from "@/modules/core/helpers/graphs";
import { GraphSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { CustomNode } from "@/modules/core/types/graph";
import { useEffect } from "react";

export const useCreateColorMapForTimeSpan = (
    nodes: CustomNode[],
    graphSettings: GraphSettings,
    updateGraphSettings: (newSettings: Partial<GraphSettings>) => void
) => {
    useEffect(() => {
        // create color map for time span every time the cases (nodes) change
        const colorMap = createColorMapForTimeSpan(nodes);
        const currentColorMap = { ...graphSettings.colorMap };
        // merge the timeSpan colorMap with the current color map in case there are already colors set and prevent overwriting
        updateGraphSettings({ colorMap: { ...currentColorMap, ...colorMap } });
    }, [nodes]);
};
