import { Skeleton } from "@/modules/core/components/ui/Skeleton";
import { lazy, Suspense } from "react";

const CasesPerDayChart = lazy(() => import("./CasesPerDayChart"));
const CasesPerClusterChart = lazy(() => import("./CasesPerClusterChart"));

export const Charts = () => {
    return (
        <div className="flex flex-col gap-4">
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <CasesPerDayChart />
            </Suspense>
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <CasesPerClusterChart />
            </Suspense>
        </div>
    );
};
