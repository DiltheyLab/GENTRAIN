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
    const failedSequenceImports = useDataManagementStore((state) => state.failedSequenceImports);
    const setFailedSequenceImports = useDataManagementStore((state) => state.setFailedSequenceImports);

    return (
        <>
            {failedSequenceImports.length > 0 && (
                <AlertDialog open>
                    <AlertDialogContent className="z-[105]">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Fehlgeschlagene Sequenzanalysen</AlertDialogTitle>
                            <AlertDialogDescription>
                                <p className="mb-2">
                                    Folgende Sequenzen konnten nicht erfolgreich analysisiert werden. Bitte überprüfen
                                    Sie die importierten FASTA-Dateien:
                                </p>
                                <p className="font-bold">
                                    {failedSequenceImports.map((fastaId) => fastaId).join(", ")}
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setFailedSequenceImports([])}>Okay</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
