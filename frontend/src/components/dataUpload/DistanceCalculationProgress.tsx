import { Progress } from "@/components/ui/progress";
import { useSampleUploadStore } from "@/stores/upload";

export function DistanceCalculationProgress() {
    const { distanceCalculationCount, distanceCalculationSum } = useSampleUploadStore();
    const totalCalculationsDone = (distanceCalculationCount * (distanceCalculationCount + 1)) / 2;
    return <Progress value={(totalCalculationsDone / distanceCalculationSum) * 100} className="w-full" />;
}
