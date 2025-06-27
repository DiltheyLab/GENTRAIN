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
                                Folgende Sequenzen konnten nicht erfolgreich analysisiert werden. Bitte überprüfen Sie
                                die importierten FASTA-Dateien:
                                <br />
                                {failedSequenceImports.join(", ")}
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
