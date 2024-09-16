import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { StepIndicator } from "@/modules/core/components/ui/StepIndicator";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Check, CircleAlert, ChevronsDown, ChevronsUp } from "lucide-react";
import { DistanceCalculationProgress } from "@/modules/data_management/components/upload_section/DistanceCalculationProgress";
import { Separator } from "@/modules/core/components/ui/Separator";

const getColorClassNames = (status: string) => {
    switch (status) {
        case "finished":
            return "text-green-600 border-green-600";
        case "failed":
            return "text-red-600 border-red-600";
        default:
            return "";
    }
};

export function SampleUploadStatus() {
    const { uploads, hideSampleUploadContent, setHideSampleUploadContent } = useDataManagementStore();
    const sequenceAnalysisRunning = useDataManagementStore((state) => state.sequenceAnalysisRunning);
    const distanceCalculationRunning = useDataManagementStore((state) => state.distanceCalculationRunning);

    return (
        <div className={`${hideSampleUploadContent ? "bg-white" : "bg-white/90"} border p-6 rounded-md`}>
            <div className="flex justify-between items-center">
                {hideSampleUploadContent && (
                    <>
                        <LoadingSpinner className="mr-4" />
                    </>
                )}
                <div>
                    {
                        <h2 className={`font-bold mr-4 ${hideSampleUploadContent ? "text-sm" : "text-lg"}`}>
                            Sequenzdaten werden hinzugefügt
                        </h2>
                    }
                    {hideSampleUploadContent && sequenceAnalysisRunning && (
                        <small>Sequenzen werden auf Mutationen untersucht</small>
                    )}
                    {hideSampleUploadContent && distanceCalculationRunning && (
                        <small>Genetische Distanzen werden berechnet</small>
                    )}
                </div>
                {hideSampleUploadContent && (
                    <ChevronsUp className="cursor-pointer ml-8" onClick={() => setHideSampleUploadContent(false)} />
                )}
                {!hideSampleUploadContent && (
                    <ChevronsDown className="cursor-pointer ml-8" onClick={() => setHideSampleUploadContent(true)} />
                )}
            </div>
            {!hideSampleUploadContent && (
                <>
                    {sequenceAnalysisRunning && (
                        <>
                            <Separator className="my-3" />
                            <div className="mb-2 mt-4 flex items-center text-sm">
                                {sequenceAnalysisRunning && <LoadingSpinner className="w-[18px] mr-2" />}
                                {!sequenceAnalysisRunning && <StepIndicator>1</StepIndicator>}
                                Sequenzen werden auf Mutationen untersucht
                            </div>
                            <small>
                                Sequenzen werden auf Mutationen in Relation zu ihrem Referenzgenom untersucht.
                            </small>

                            <div className="w-full flex flex-wrap max-h-[300px] overflow-y-auto mt-2">
                                {Object.keys(uploads).map((fastaId, key) => (
                                    <div key={key} className="w-1/6 p-1">
                                        <div
                                            key={fastaId}
                                            className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white ${getColorClassNames(
                                                uploads[fastaId]
                                            )}`}
                                        >
                                            <div className="mr-2 text-xs">{fastaId}</div>

                                            {uploads[fastaId] === "pending" && <LoadingSpinner className="w-[18px]" />}
                                            {uploads[fastaId] === "finished" && <Check width={18} />}
                                            {uploads[fastaId] === "failed" && <CircleAlert width={18} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    {distanceCalculationRunning && (
                        <>
                            <Separator className="my-3" />
                            <div className="mb-2 flex items-center text-sm">
                                {distanceCalculationRunning && <LoadingSpinner className="w-[18px] mr-2" />}
                                {!distanceCalculationRunning && <StepIndicator>2</StepIndicator>}
                                Genetische Distanzen werden berechnet
                            </div>
                            <small>
                                Auf Basis der Mutationen aller Samples werden die genetische Distanzen zwischen den
                                Samples berechnet.
                            </small>
                            <div className="mt-2">
                                <DistanceCalculationProgress />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
