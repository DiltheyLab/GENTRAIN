import { useEffect, useState } from "react";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { useTranslation } from "react-i18next";

export const useGetGeneticDistanceLinkCount = () => {
    const { links } = useOutbreakAnalysisStore((state) => state.graphData);
    const { t } = useTranslation();
    const [geneticDistanceLinkCount, setGeneticDistanceLinkCount] = useState(0);

    useEffect(() => {
        setGeneticDistanceLinkCount(links.filter((link) => link.type === t("linkTypes.geneticDistance")).length)
    }, [links]);

    return geneticDistanceLinkCount;
};
