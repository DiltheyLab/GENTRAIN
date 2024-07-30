import { Progress } from "@/components/ui/progress";
import { useSampleUploadStore } from "@/stores/upload";

export function DistanceCalculationProgress() {
    const { distanceCalculationCount, distanceCalculationSum } = useSampleUploadStore();
    return <Progress value={(distanceCalculationCount / distanceCalculationSum) * 100} className="w-full" />;
}
