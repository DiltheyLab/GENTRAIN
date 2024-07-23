import { Progress } from "@/components/ui/progress";
import { useSampleUploadStore } from "@/stores/upload";
import { useEffect } from "react";

export function DistanceCalculationProgress() {
    const distanceCalculationProgress = useSampleUploadStore((state) => state.distanceCalculationProgress);

    useEffect(() => {
        console.log(distanceCalculationProgress);
    }, [distanceCalculationProgress]);
    return <Progress value={distanceCalculationProgress} className="w-full" />;
}
