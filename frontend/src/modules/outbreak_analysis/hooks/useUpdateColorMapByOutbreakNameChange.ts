import { useEffect } from "react";
import { useGetOutbreaksForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksForActivePathogen";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { ColorMapGeneratorStrategy } from "@/modules/core/services/graph/ColorMapGeneratorStrategy";

export const useUpdateColorMapByOutbreakNameChange = () => {
    const outbreaks = useGetOutbreaksForActivePathogen();
    const graphSettings = useOutbreakAnalysisStore((state) => state.graphSettings);

    return useEffect(() => {
        if (!outbreaks) return;
        graphSettings.colorMap = ColorMapGeneratorStrategy.updateClustersInColorMap(
            graphSettings.colorMap,
            outbreaks.map((outbreak) => outbreak.name)
        );
    }, [outbreaks]);
};
