import { Progress } from "@/modules/core/components/ui/Progress";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export function DistanceCalculationProgress() {
    const { distanceCalculationCount, distanceCalculationSum } = useDataManagementStore();
    const totalCalculationsDone = (distanceCalculationCount * (distanceCalculationCount + 1)) / 2;
    return <Progress value={(totalCalculationsDone / distanceCalculationSum) * 100} className="w-full border" />;
}
