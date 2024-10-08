import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { StepIndicator } from "@/modules/core/components/ui/StepIndicator";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Check, CircleAlert, ChevronsDown, ChevronsUp, CircleDashed } from "lucide-react";
import { DistanceCalculationProgress } from "@/modules/data_management/components/sample_upload_status/DistanceCalculationProgress";
import { Separator } from "@/modules/core/components/ui/Separator";
import { ScrollArea } from "@/modules/core/components/ui/scroll-area";

const getColorClassNames = (status: string) => {
    switch (status) {
        case "sent":
            return "text-slate-200 border-slate-200";
        case "enqueued":
            return "text-slate-700 border-slate-700";
        case "started":
            return "text-yellow-600 border-yellow-600";
        case "finished":
            return "text-green-600 border-green-600";
        case "failed":
            return "text-red-600 border-red-600";
        default:
            return "";
    }
};

export function SampleUploadStatus() {
    const sampleImports = useDataManagementStore((state) => state.sampleImports);
    const setHideSampleUploadContent = useDataManagementStore((state) => state.setHideSampleUploadContent);
    const hideSampleUploadContent = useDataManagementStore((state) => state.hideSampleUploadContent);
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
                        <small className="mr-6">
                            Sequenzen werden auf Mutationen untersucht{" "}
                            <span>
                                (
                                {
                                    Object.keys(sampleImports).filter(
                                        (key: string) => sampleImports[key].status === "finished"
                                    ).length
                                }{" "}
                                von {Object.keys(sampleImports).filter((key) => sampleImports[key].upload).length}{" "}
                                abgeschlossen)
                            </span>
                        </small>
                    )}
                    {hideSampleUploadContent && distanceCalculationRunning && (
                        <>
                            <small>Genetische Distanzen werden berechnet</small>
                        </>
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
                            <ScrollArea>
                                <div className="w-full flex flex-wrap max-h-[300px] mt-2">
                                    {Object.keys(sampleImports).map((fastaId) => {
                                        if (!sampleImports[fastaId].upload) return;
                                        return (
                                            <div key={fastaId} className="w-full sm:w-1/3 p-1">
                                                <div
                                                    className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white ${getColorClassNames(
                                                        sampleImports[fastaId].status
                                                    )}`}
                                                >
                                                    <div className="mr-2 text-xs">{fastaId}</div>
                                                    {sampleImports[fastaId].status === "sent" && (
                                                        <CircleDashed className="mr-[1px]" width={15} />
                                                    )}
                                                    {sampleImports[fastaId].status === "enqueued" && (
                                                        <CircleDashed className="mr-[1px]" width={15} />
                                                    )}
                                                    {sampleImports[fastaId].status === "started" && (
                                                        <LoadingSpinner className="w-[17px]" strokeWidth={1.5} />
                                                    )}
                                                    {sampleImports[fastaId].status === "finished" && (
                                                        <Check width={18} />
                                                    )}
                                                    {sampleImports[fastaId].status === "failed" && (
                                                        <CircleAlert width={18} />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
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
