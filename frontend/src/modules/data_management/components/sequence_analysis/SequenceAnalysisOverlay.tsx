import { useDataManagementStore } from "../../stores/dataManagement";
import { FailedSequenceAnalysesDialog } from "./FailedSequenceAnalysesDialog";
import { SequenceAnalysisModal } from "./SequenceAnalysisModal";

export function SequenceAnalysisOverlay() {
    const hideSequenceUploadContent = useDataManagementStore((state) => state.hideSequenceUploadContent);
    const sequenceAnalysisRunning = useDataManagementStore((state) => state.sequenceAnalysisRunning);
    const distanceCalculationRunning = useDataManagementStore((state) => state.distanceCalculationRunning);
    const showImportAssistent = useDataManagementStore((state) => state.showImportAssistent);

    return (
        <>
            {(sequenceAnalysisRunning || distanceCalculationRunning) && !showImportAssistent && (
                <div className="relative z-50">
                    <div
                        className={`fixed bottom-0 right-0 p-8 ${
                            hideSequenceUploadContent ? "w-auto" : "w-full md:w-2/3 lg:w-1/2"
                        }`}
                    >
                        <SequenceAnalysisModal />
                    </div>
                </div>
            )}
            <FailedSequenceAnalysesDialog />
        </>
    );
}
