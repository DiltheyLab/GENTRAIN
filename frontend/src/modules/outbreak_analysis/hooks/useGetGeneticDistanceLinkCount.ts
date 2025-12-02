import { useMemo } from "react";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { useTranslation } from "react-i18next";

export const useGetGeneticDistanceLinkCount = () => {
    const { links } = useOutbreakAnalysisStore((state) => state.graphData);
    const { t } = useTranslation();
    const geneticDistanceType = t("linkTypes.geneticDistance");

    return useMemo(() => {
        return links.filter((link) => link.type === geneticDistanceType).length;
    }, [links, geneticDistanceType]);
};
