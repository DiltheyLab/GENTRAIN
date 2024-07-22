import { useSampleUploadStore } from "@/stores/upload";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Check } from "lucide-react";

export function SampleUploadStatus() {
    const pendingUploads = useSampleUploadStore((state) => state.pendingUploads);
    const finishedUploads = useSampleUploadStore((state) => state.finishedUploads);
    const uploading = useSampleUploadStore((state) => state.uploading);

    if (pendingUploads.length === 0 && finishedUploads.length === 0) return;
    return (
        <div className="w-[200px] border-[1px] border-muted rounded-md overflow-x-hidden overflow-y-scroll max-h-[300px]">
            {finishedUploads.map((fastaId) => (
                <div
                    key={fastaId}
                    className="flex items-center justify-between h-[25px] even:bg-muted odd:bg-white p-4"
                >
                    <small>{fastaId}</small> <Check />
                </div>
            ))}
            {pendingUploads.map((fastaId) => (
                <div
                    key={fastaId}
                    className="flex items-center justify-between h-[25px] even:bg-muted odd:bg-white p-4"
                >
                    <small>{fastaId}</small>
                    {uploading && <LoadingSpinner />}
                </div>
            ))}
        </div>
    );
}
