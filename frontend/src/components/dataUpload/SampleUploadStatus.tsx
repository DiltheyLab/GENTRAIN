import { useSampleUploadStore } from "@/stores/upload";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Check, X } from "lucide-react";
import { DistanceCalculationProgress } from "./DistanceCalculationProgress";

export function SampleUploadStatus() {
    const pendingUploads = useSampleUploadStore((state) => state.pendingUploads);
    const finishedUploads = useSampleUploadStore((state) => state.finishedUploads);
    const uploading = useSampleUploadStore((state) => state.uploading);

    if (pendingUploads.length === 0 && finishedUploads.length === 0) return;
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
                        <div className="mr-2 text-xs">{fastaId}</div> <Check width={20} />
                    </div>
                ))}
                {pendingUploads.map((fastaId) => (
                    <div
                        key={fastaId}
                        className="bg-white flex items-center justify-between h-[25px] border-[1px] py-4 pl-2 pr-1 rounded-md"
                    >
                        <div className="mr-2 text-xs">{fastaId}</div>
                        {uploading && <LoadingSpinner className="w-[20px]" />}
                        {!uploading && <X width={20} className="cursor-pointer" />}
                    </div>
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
