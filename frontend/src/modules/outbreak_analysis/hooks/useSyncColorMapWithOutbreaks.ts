import { useEffect } from "react";
import { useGetOutbreaksForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksForActivePathogen";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { ColorMapGeneratorStrategy } from "@/modules/core/services/graph/ColorMapGeneratorStrategy";

export const useSyncColorMapWithOutbreaks = () => {
    const outbreaks = useGetOutbreaksForActivePathogen();
    const graphSettings = useOutbreakAnalysisStore((state) => state.graphSettings);
    const selectedOutbreak = useOutbreakAnalysisStore((state) => state.analysisSettings.selectedOutbreak);

    // if the user changes an outbreakname or add a new outbreak which is not already in the colormap of the analysis,
    // we have to update the colormap to show the new outbreakname with a correct color
    return useEffect(() => {
        if (!outbreaks) return;
        graphSettings.colorMap = ColorMapGeneratorStrategy.updateClustersInColorMap(
            graphSettings.colorMap,
            outbreaks.map((outbreak) => outbreak.name),
            selectedOutbreak?.name
        );
    }, [outbreaks]);
};
