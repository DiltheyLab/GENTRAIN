import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { Separator } from "@/modules/core/components/ui/Separator";
import { SequenceAnalysisStatus } from "./SequenceAnalysisStatus";

export function SequenceAnalysisModal() {
    const sampleImports = useDataManagementStore((state) => state.sampleImports);
    const setHideSampleUploadContent = useDataManagementStore((state) => state.setHideSampleUploadContent);
    const hideSampleUploadContent = useDataManagementStore((state) => state.hideSampleUploadContent);
    const sequenceAnalysisRunning = useDataManagementStore((state) => state.sequenceAnalysisRunning);
    const distanceCalculationRunning = useDataManagementStore((state) => state.distanceCalculationRunning);
    const showImportAssistent = useDataManagementStore((state) => state.showImportAssistent);

    return (
        <>
            {(sequenceAnalysisRunning || distanceCalculationRunning) && !showImportAssistent && (
                <div className="relative z-50">
                    <div
                        className={`fixed bottom-0 right-0 p-8 ${
                            hideSampleUploadContent ? "w-auto" : "w-full md:w-2/3 lg:w-1/2"
                        }`}
                    >
                        <div
                            className={`${hideSampleUploadContent ? "bg-white" : "bg-white/90"} border p-6 rounded-md`}
                        >
                            <div className="flex justify-between items-center">
                                {hideSampleUploadContent && (
                                    <>
                                        <LoadingSpinner className="mr-4" />
                                    </>
                                )}
                                <div>
                                    <h2 className={`font-bold mr-4 ${hideSampleUploadContent ? "text-sm" : "text-lg"}`}>
                                        Sequenzdaten werden hinzugefügt
                                    </h2>
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
                                                von{" "}
                                                {
                                                    Object.keys(sampleImports).filter(
                                                        (key) => sampleImports[key].import
                                                    ).length
                                                }{" "}
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
                                    <ChevronsUp
                                        className="cursor-pointer ml-8"
                                        onClick={() => setHideSampleUploadContent(false)}
                                    />
                                )}
                                {!hideSampleUploadContent && (
                                    <ChevronsDown
                                        className="cursor-pointer ml-8"
                                        onClick={() => setHideSampleUploadContent(true)}
                                    />
                                )}
                            </div>
                            {!hideSampleUploadContent && (
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
