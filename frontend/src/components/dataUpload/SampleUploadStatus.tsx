import { useSampleUploadStore } from "@/stores/upload";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Check, CircleAlert, X } from "lucide-react";
import { DistanceCalculationProgress } from "./DistanceCalculationProgress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { SampleInfoCard } from "./SampleInfoCard";

const getColorClassNames = (status: string) => {
    switch (status) {
        case "finished":
            return "text-green-600";
        case "failed":
            return "text-red-600";
        default:
            return "";
    }
};

export function SampleUploadStatus() {
    const { uploads, isUploading, removeUpload } = useSampleUploadStore();

    if (Object.keys(uploads).length === 0) return;
    return (
        <div className="bg-muted p-6">
            <div className="mb-2 flex items-center text-sm">
                <div className="flex items-center justify-center bg-slate-900 w-[18px] h-[18px] rounded-full mr-2 font-bold text-white">
                    1
                </div>
                Sequenzanalyse
            </div>
            <div className="mb-6 w-full flex flex-wrap gap-2">
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
