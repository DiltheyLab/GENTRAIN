import { useCoreStore } from "@/modules/core/stores/core";
import { useEffect } from "react";
import { useDashboardStore } from "../stores/dashboard";

export const useUpdateClusterAndGeneticDistanceThresholds = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const updateSettings = useDashboardStore((state) => state.updateSettings);

    return useEffect(() => {
        if (!activePathogen) return;
        updateSettings({
            clusteringThreshold: activePathogen?.genetic_distance_threshold ?? 0,
            geneticDistanceThreshold: activePathogen?.genetic_distance_threshold ?? 0,
        });
    }, [activePathogen]);
};
