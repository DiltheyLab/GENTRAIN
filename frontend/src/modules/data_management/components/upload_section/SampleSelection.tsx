import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { X } from "lucide-react";
import { SampleInfoCard } from "@/modules/data_management/components/upload_section/SampleInfoCard";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/modules/core/components/ui/HoverCard";

const getColorClassNames = (status: string) => {
    switch (status) {
        case "finished":
            return "text-green-600 border-green-600";
        case "failed":
            return "text-red-600 border-red-600";
        default:
            return "";
    }
};

export function SampleSelection() {
    const uploads = useDataManagementStore((state) => state.uploads);
    const removeUpload = useDataManagementStore((state) => state.removeUpload);

    return (
        <>
            <div className="w-full flex flex-wrap gap-2">
                <small>
                    Folgende Samples wurden in der Fastadatei gefunden und werden dem Datenbestand hinzugefügt. Durch
                    Hovern über eine Fasta ID können Sie sich weitere Informationen anzeigen lassen und durch Klick auf
                    das Kreuz die jeweilige Sequenz vom Upload ausschließen.
                </small>
                {Object.keys(uploads).map((fastaId) => (
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
        </>
    );
}
