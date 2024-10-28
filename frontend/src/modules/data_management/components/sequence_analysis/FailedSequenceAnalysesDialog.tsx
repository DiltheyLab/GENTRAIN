import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/modules/core/components/ui/AlertDialog";
import { useDataManagementStore } from "../../stores/dataManagement";

export function FailedSequenceAnalysesDialog() {
    const failedSampleImports = useDataManagementStore((state) => state.failedSampleImports);
    const setFailedSampleImports = useDataManagementStore((state) => state.setFailedSampleImports);

    return (
        <>
            {failedSampleImports && (
                <AlertDialog open>
                    <AlertDialogContent className="z-[105]">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Fehlgeschlagene Sequenzanalysen</AlertDialogTitle>
                            <AlertDialogDescription>
                                <p className="mb-2">
                                    Folgende Sequenzen konnten nicht erfolgreich analysisiert werden. Bitte überprüfen
                                    Sie die importierten FASTA-Dateien:
                                </p>
                                <p className="font-bold">{failedSampleImports.map((fastaId) => fastaId).join(", ")}</p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setFailedSampleImports(null)}>Okay</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
