import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { StepIndicator } from "@/modules/core/components/ui/StepIndicator";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Check, CircleAlert, CircleDashed } from "lucide-react";
import { DistanceCalculationProgress } from "@/modules/data_management/components/sequence_analysis/DistanceCalculationProgress";
import { ScrollArea } from "@/modules/core/components/ui/scroll-area";
import { getSampleStatusColorClassNames } from "../../helpers/samples";

export function SequenceAnalysisStatus() {
    const sampleImports = useDataManagementStore((state) => state.sampleImports);
    const sequenceAnalysisRunning = useDataManagementStore((state) => state.sequenceAnalysisRunning);
    const distanceCalculationRunning = useDataManagementStore((state) => state.distanceCalculationRunning);
    const showInitialUpload = useDataManagementStore((state) => state.showInitialUpload);

    return (
        <>
            {sequenceAnalysisRunning && (
                <>
                    <div className={`mb-2 mt-4 flex items-center ${showInitialUpload ? "text-md" : "text-sm"}`}>
                        {sequenceAnalysisRunning && <LoadingSpinner className="w-[18px] mr-2" />}
                        {!sequenceAnalysisRunning && <StepIndicator>1</StepIndicator>}
                        Sequenzen werden auf Mutationen untersucht
                    </div>
                    {!showInitialUpload && (
                        <small className="block mb-2">
                            Sequenzen werden auf Mutationen in Relation zu ihrem Referenzgenom untersucht.
                        </small>
                    )}
                    <ScrollArea>
                        <div className="w-full flex flex-wrap max-h-[300px]">
                            {Object.keys(sampleImports).map((fastaId) => {
                                if (!sampleImports[fastaId].import) return;
                                return (
                                    <div key={fastaId} className="w-full sm:w-1/3 p-1">
                                        <div
                                            className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white ${getSampleStatusColorClassNames(
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
                                            {sampleImports[fastaId].status === "finished" && <Check width={18} />}
                                            {sampleImports[fastaId].status === "failed" && <CircleAlert width={18} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                    {showInitialUpload && (
                        <div className="flex gap-2 flex-wrap justify-end mt-4">
                            <div
                                className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white ${getSampleStatusColorClassNames(
                                    "sent"
                                )}`}
                            >
                                <div className="mr-2 text-xs">Datenübertragung</div>
                                <CircleDashed className="mr-[1px]" width={15} />
                            </div>
                            <div
                                className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white ${getSampleStatusColorClassNames(
                                    "queued"
                                )}`}
                            >
                                <div className="mr-2 text-xs">Warteschlange</div>
                                <CircleDashed className="mr-[1px]" width={15} />
                            </div>
                            <div
                                className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white ${getSampleStatusColorClassNames(
                                    "started"
                                )}`}
                            >
                                <div className="mr-2 text-xs">In Bearbeitung</div>
                                <LoadingSpinner className="w-[17px]" strokeWidth={1.5} animate={false} />
                            </div>
                            <div
                                className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white ${getSampleStatusColorClassNames(
                                    "finished"
                                )}`}
                            >
                                <div className="mr-2 text-xs">Beendet</div>
                                <Check width={18} />
                            </div>
                            <div
                                className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white ${getSampleStatusColorClassNames(
                                    "failed"
                                )}`}
                            >
                                <div className="mr-2 text-xs">Fehlgeschlagen</div>
                                <CircleAlert width={18} />
                            </div>
                        </div>
                    )}
                </>
            )}
            {distanceCalculationRunning && (
                <>
                    <div className={`mb-2 flex items-center ${showInitialUpload ? "text-md" : "text-sm"}`}>
                        {distanceCalculationRunning && <LoadingSpinner className="w-[18px] mr-2" />}
                        {!distanceCalculationRunning && <StepIndicator>2</StepIndicator>}
                        Genetische Distanzen werden berechnet
                    </div>
                    {!showInitialUpload && (
                        <small className="block mb-2">
                            Auf Basis der Mutationen der sequenzierten Fälle werden genetische Distanzen zwischen den
                            Fällen berechnet.
                        </small>
                    )}
                    <div>
                        <DistanceCalculationProgress />
                    </div>
                </>
            )}
        </>
    );
}
