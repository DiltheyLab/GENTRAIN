import { useUploadStore } from "@/stores/upload";
import { LoadingSpinner } from "../ui/loading-spinner";

export function SampleUploadStatus() {
    const sampleUploads = useUploadStore((state) => state.sampleUploads);

    return (
        <>
            {Object.keys(sampleUploads).map((fastaId) => (
                <div key={fastaId}>
                    <small>{fastaId}</small> {sampleUploads[fastaId] === "loading" && <LoadingSpinner />}
                </div>
            ))}
        </>
    );
}
