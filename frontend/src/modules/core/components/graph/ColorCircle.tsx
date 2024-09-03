import { COLOR_FOR_CASES_WITHOUT_CLUSTERS } from "../../helpers/colors";
import { ColorMap } from "../../types/graph";

type ColorCirlceProps = {
    colorMap: ColorMap;
    cluster: string;
};

export const ColorCircle = ({ colorMap, cluster }: ColorCirlceProps) => {
    return (
        <span
            style={{
                backgroundColor: `${
                    colorMap[cluster]?.isActive ? colorMap[cluster].color : COLOR_FOR_CASES_WITHOUT_CLUSTERS
                }`,
            }}
            className={"rounded-full h-3 w-3"}
        />
    );
};
