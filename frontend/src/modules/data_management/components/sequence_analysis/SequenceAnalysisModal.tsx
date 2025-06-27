import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { Separator } from "@/modules/core/components/ui/Separator";
import { SequenceAnalysisStatus } from "./SequenceAnalysisStatus";

export function SequenceAnalysisModal() {
    const sequenceImports = useDataManagementStore((state) => state.sequenceImports);
    const setHideSequenceUploadContent = useDataManagementStore((state) => state.setHideSequenceUploadContent);
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
                        <div
                            className={`${
                                hideSequenceUploadContent ? "bg-white" : "bg-white/90"
                            } border p-6 rounded-md`}
                        >
                            <div className="flex justify-between items-center">
                                {hideSequenceUploadContent && (
                                    <>
                                        <LoadingSpinner className="mr-4" />
                                    </>
                                )}
                                <div>
                                    <h2
                                        className={`font-bold mr-4 ${
                                            hideSequenceUploadContent ? "text-sm" : "text-lg"
                                        }`}
                                    >
                                        Sequenzdaten werden hinzugefügt
                                    </h2>
                                    {hideSequenceUploadContent && sequenceAnalysisRunning && (
                                        <small className="mr-6">
                                            Sequenzen werden auf Mutationen untersucht{" "}
                                            <span>
                                                (
                                                {
                                                    Object.keys(sequenceImports).filter(
                                                        (key: string) => sequenceImports[key].status === "success"
                                                    ).length
                                                }{" "}
                                                von{" "}
                                                {
                                                    Object.keys(sequenceImports).filter((key) => sequenceImports[key])
                                                        .length
                                                }{" "}
                                                abgeschlossen)
                                            </span>
                                        </small>
                                    )}
                                    {hideSequenceUploadContent && distanceCalculationRunning && (
                                        <>
                                            <small>Genetische Distanzen werden berechnet</small>
                                        </>
                                    )}
                                </div>

                                {hideSequenceUploadContent && (
                                    <ChevronsUp
                                        className="cursor-pointer ml-8"
                                        onClick={() => setHideSequenceUploadContent(false)}
                                    />
                                )}
                                {!hideSequenceUploadContent && (
                                    <ChevronsDown
                                        className="cursor-pointer ml-8"
                                        onClick={() => setHideSequenceUploadContent(true)}
                                    />
                                )}
                            </div>
                            {!hideSequenceUploadContent && (
                                <>
                                    <Separator className="my-3" />
                                    <SequenceAnalysisStatus />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
