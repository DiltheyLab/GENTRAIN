import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { StepIndicator } from "@/modules/core/components/ui/StepIndicator";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Check, CircleAlert, X, ChevronsDown, ChevronsUp } from "lucide-react";
import { DistanceCalculationProgress } from "@/modules/data_management/components/upload_section/DistanceCalculationProgress";
import { SampleInfoCard } from "@/modules/data_management/components/upload_section/SampleInfoCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/modules/core/components/ui/HoverCard";

const getColorClassNames = (status: string) => {
    switch (status) {
        case "finished":
            return "text-green-600 border-green-600 hover:border-white";
        case "failed":
            return "text-red-600 border-red-600 hover:border-white";
        default:
            return "";
    }
};

export function SampleUploadStatus() {
    const { uploads, isUploading, removeUpload, hideSampleUploadContent, setHideSampleUploadContent } =
        useDataManagementStore();
    if (Object.keys(uploads).length === 0) return null;
    return (
        <div className={`bg-white ${isUploading ? "border p-6 rounded-md" : "w-1/2"}`}>
            {isUploading && (
                <div className="flex justify-between">
                    {<h2 className="font-bold">Sequenzdaten werden hinzugefügt ...</h2>}
                    {hideSampleUploadContent && (
                        <ChevronsUp className="cursor-pointer" onClick={() => setHideSampleUploadContent(false)} />
                    )}
                    {!hideSampleUploadContent && (
                        <ChevronsDown className="cursor-pointer" onClick={() => setHideSampleUploadContent(true)} />
                    )}
                </div>
            )}
            {!hideSampleUploadContent && (
                <>
                    {isUploading && (
                        <div className="mb-2 mt-4 flex items-center text-sm">
                            <StepIndicator>1</StepIndicator>
                            Sequenzen werden auf Mutationen untersucht
                        </div>
                    )}
                    <div className="w-full flex flex-wrap gap-2">
                        {isUploading &&
                            Object.keys(uploads).map((fastaId) => (
                                <HoverCard key={fastaId} openDelay={50} closeDelay={50}>
                                    <HoverCardTrigger asChild>
                                        <div
                                            key={fastaId}
                                            className={`cursor-default flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md bg-white hover:bg-slate-900 hover:text-white ${getColorClassNames(
                                                uploads[fastaId]
                                            )}`}
                                        >
                                            <div className="mr-2 text-xs">{fastaId}</div>

                                            {uploads[fastaId] === "pending" && isUploading && (
                                                <LoadingSpinner className="w-[18px]" />
                                            )}
                                            {uploads[fastaId] === "finished" && <Check width={18} />}
                                            {uploads[fastaId] === "failed" && <CircleAlert width={18} />}
                                        </div>
                                    </HoverCardTrigger>
                                    {uploads[fastaId] === "failed" && (
                                        <HoverCardContent>
                                            <small>Invalide genetische Sequenz</small>
                                        </HoverCardContent>
                                    )}
                                    {uploads[fastaId] !== "failed" && (
                                        <HoverCardContent>
                                            <SampleInfoCard fastaId={fastaId} />
                                        </HoverCardContent>
                                    )}
                                </HoverCard>
                            ))}
                        {!isUploading &&
                            Object.keys(uploads).map((fastaId) => (
                                <HoverCard key={fastaId} openDelay={50} closeDelay={50}>
                                    <HoverCardTrigger asChild>
                                        <div
                                            key={fastaId}
                                            className={`hover:bg-slate-900 hover:text-white cursor-default bg-white flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md ${getColorClassNames(
                                                uploads[fastaId]
                                            )}`}
                                        >
                                            <div className="mr-2 text-xs">{fastaId}</div>
                                            <X
                                                width={18}
                                                className="cursor-pointer font-normal"
                                                onClick={() => removeUpload(fastaId)}
                                            />
                                        </div>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <SampleInfoCard fastaId={fastaId} />
                                    </HoverCardContent>
                                </HoverCard>
                            ))}
                    </div>
                    {isUploading && (
                        <>
                            <div className="mt-6 mb-2 flex items-center text-sm">
                                <StepIndicator>2</StepIndicator>
                                Genetische Distanzen werden berechnet
                            </div>
                            <DistanceCalculationProgress />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
