import { CasesPerDayChart } from "./CasesPerDayChart";
import { CasesPerClusterChart } from "./CasesPerClusterChart";

export const Charts = () => {
    return (
        <>
            <CasesPerDayChart />
            <CasesPerClusterChart />
        </>
    );
};
