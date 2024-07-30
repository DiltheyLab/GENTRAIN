import { Progress } from "@/components/ui/progress";
import { useSampleUploadStore } from "@/stores/upload";

export function DistanceCalculationProgress() {
    const { distanceCalculationProgress } = useSampleUploadStore();
    return <Progress value={distanceCalculationProgress} className="w-full" />;
}
