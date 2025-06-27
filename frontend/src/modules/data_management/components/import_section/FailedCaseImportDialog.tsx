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
import { t } from "i18next";

export function FailedCaseImportDialog() {
    const failedCaseImports = useDataManagementStore((state) => state.failedCaseImports);
    const setFailedCaseImports = useDataManagementStore((state) => state.setFailedCaseImports);
    return (
        <AlertDialog open>
            <AlertDialogContent className="z-[105]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Fehlgeschlagene Fallimports</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="max-h-[50vh] overflow-x-scroll mb-2">
                    <span className="block mb-2 font-bold">
                        Folgende Fälle konnten nicht erfolgreich importiert werden werden.
                    </span>
                    {Object.keys(failedCaseImports).map((caseId) => {
                        return (
                            <div key={`${caseId}_error`}>
                                <span className="font-bold">{caseId}: </span>
                                {failedCaseImports[caseId]
                                    .map((errorPath) => t(`error:case_import:${errorPath}`))
                                    .join(", ")}
                            </div>
                        );
                    })}
                </AlertDialogDescription>

                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setFailedCaseImports({})}>Okay</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
