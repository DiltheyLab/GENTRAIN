import i18next from "i18next";
import {
    COLOR_FOR_CASES_WITHOUT_CLUSTERS,
    COLOR_FOR_SELECTED_OUTBREAK,
    COLOR_PALETTE_NODES,
    createColorByGoldenAngleApproximation,
} from "@/modules/core/helpers/colors";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { ColorMap } from "@/modules/core/types/graph";

export abstract class ColorMapGeneratorStrategy {
    protected colorMap: ColorMap = {};
    protected clusters: string[] = [];
    protected selectedOutbreak: OutbreakSchema | undefined;

    protected abstract getUniqueClusters(): void;

    constructor(selectedOutbreak?: OutbreakSchema) {
        this.selectedOutbreak = selectedOutbreak;
    }

    public createColorMapForClusters = (): ColorMap => {
        this.getUniqueClusters();
        this.assignSpecialColors();
        this.assignClusterColors();
        return this.colorMap;
    };

    private assignSpecialColors = () => {
        this.setNoAssignedClusterColor();
        this.setSelectedOutbreakColor();
    };

    private setNoAssignedClusterColor = () => {
        const noAssignedCluster = this.clusters.find(
            (cluster) =>
                cluster === i18next.t("clusterTypes.noOutbreakAssigned") ||
                cluster === i18next.t("clusterTypes.noClusterAssigned")
        );

        // if there are clusters like noOutbreakAssigned or noClusterAssigned give this cluster a specific color
        if (noAssignedCluster) {
            this.colorMap[noAssignedCluster] = {
                color: COLOR_FOR_CASES_WITHOUT_CLUSTERS,
                isActive: true,
            };
            this.clusters.splice(this.clusters.indexOf(noAssignedCluster), 1);
        }
    };

    private setSelectedOutbreakColor = () => {
        const selectedOutbreakCluster = this.clusters.find((cluster) => cluster === this.selectedOutbreak?.name);
        if (this.selectedOutbreak && selectedOutbreakCluster) {
            this.colorMap[selectedOutbreakCluster] = { color: COLOR_FOR_SELECTED_OUTBREAK, isActive: true };
            this.clusters.splice(this.clusters.indexOf(selectedOutbreakCluster), 1);
        }
    };

    private assignClusterColors = () => {
        for (let i = 0; i < this.clusters.length; i++) {
            this.colorMap[this.clusters[i]] = {
                color: COLOR_PALETTE_NODES[i] || createColorByGoldenAngleApproximation(i),
                isActive: true,
            };
        }
    };
}
