import { useSampleUploadStore } from "@/stores/upload";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Check, CircleAlert, X } from "lucide-react";
import { DistanceCalculationProgress } from "./DistanceCalculationProgress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { SampleInfoCard } from "./SampleInfoCard";

export function SampleUploadStatus() {
    const { pendingUploads, addToRemovedSamples, isUploading, finishedUploads, failedUploads } = useSampleUploadStore();

    if (pendingUploads.length === 0 && finishedUploads.length === 0 && failedUploads.length === 0) return;
    return (
        <div className="bg-muted p-6">
            <div className="mb-2 flex items-center text-sm">
                <div className="flex items-center justify-center bg-slate-900 w-[18px] h-[18px] rounded-full mr-2 font-bold text-white">
                    1
                </div>
                Sequenzanalyse
            </div>
            <div className="mb-6 w-full flex flex-wrap gap-2">
                {finishedUploads.map((fastaId) => (
                    <div
                        key={fastaId}
                        className="bg-white flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md"
                    >
                        <div className="mr-2 text-xs">{fastaId}</div> <Check width={18} />
                    </div>
                ))}
                {failedUploads.map((fastaId) => (
                    <HoverCard key={fastaId} openDelay={50} closeDelay={50}>
                        <HoverCardTrigger asChild>
                            <div
                                key={fastaId}
                                className="hover:bg-slate-900 hover:text-white cursor-default bg-white flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md"
                            >
                                <div className="mr-2 text-xs">{fastaId}</div> <CircleAlert width={18} />
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto text-center">
                            <small>Invalide genetische Sequenz</small>
                        </HoverCardContent>
                    </HoverCard>
                ))}
                {pendingUploads.map((fastaId) => (
                    <HoverCard key={fastaId} openDelay={50} closeDelay={50}>
                        <HoverCardTrigger asChild>
                            <div
                                key={fastaId}
                                className="hover:bg-slate-900 hover:text-white cursor-default bg-white flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md"
                            >
                                <div className="mr-2 text-xs">{fastaId}</div>
                                {isUploading && <LoadingSpinner className="w-[18px]" />}
                                {!isUploading && (
                                    <X
                                        width={18}
                                        className="cursor-pointer font-normal"
                                        onClick={() => addToRemovedSamples(fastaId)}
                                    />
                                )}
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <SampleInfoCard fastaId={fastaId} />
                        </HoverCardContent>
                    </HoverCard>
                ))}
            </div>
            <div className="mb-2 flex items-center text-sm">
                <div className="flex items-center justify-center bg-slate-900 w-[18px] h-[18px] rounded-full mr-2 font-bold text-white">
                    2
                </div>
                Distanzberechnung
            </div>
            <DistanceCalculationProgress />
        </div>
    );
}
