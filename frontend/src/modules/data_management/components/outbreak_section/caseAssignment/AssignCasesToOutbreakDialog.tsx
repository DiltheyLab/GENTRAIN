import { Button } from "@/modules/core/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/modules/core/components/ui/Dialog";
import { handleError } from "@/modules/core/helpers/errors";
import { lazy, Suspense, useState } from "react";
import { bulkUpdateCases, CaseToUpdate, CaseWithRelationships } from "@/modules/core/models/cases";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { useCoreStore } from "@/modules/core/stores/core";
import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";

const CaseAssignment = lazy(
    () => import("@/modules/data_management/components/outbreak_section/caseAssignment/CaseAssignment")
);

export const AssignCasesToOutbreakDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [casesForUpdate, setCasesForUpdate] = useState<Map<number, CaseWithRelationships>>(new Map());
    const updateCasesWithRelationships = useCoreStore((state) => state.updateCasesWithRelationships);

    const { toast } = useToast();

    const saveAssignment = async () => {
        try {
            const changes: CaseToUpdate[] = [];
            for (const [id, caseData] of casesForUpdate) {
                changes.push({ key: id, changes: { outbreak_id: caseData.outbreak_id } });
            }
            await bulkUpdateCases(changes);
            updateCasesWithRelationships();
            toast({
                title: "Die Fälle wurden erfolgreich zugewiesen",
                variant: "success",
                duration: 5000,
            });
            setIsOpen(false);
        } catch (error) {
            handleError(error, "caseAssignment");
        }
    };

    const registerCaseForDatabaseUpdate = (caseData: CaseWithRelationships, selectedOutbreakTable: string) => {
        setCasesForUpdate((prevCasesMap) => {
            if (selectedOutbreakTable === undefined) {
                return prevCasesMap;
            }

            const newCasesMap = new Map(prevCasesMap);
            const newCase = caseData;
            newCase.outbreak_id = +selectedOutbreakTable;
            newCasesMap.set(newCase.id, newCase);

            return newCasesMap;
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Fälle einem Ausbruch zuordnen</Button>
            </DialogTrigger>
            <DialogContent className="max-w-none w-[calc(100vw-100px)] h-[calc(100vh-100px)]">
                <DialogHeader>
                    <DialogTitle>Fälle einem anderen Ausbruch zuordnen</DialogTitle>
                    <DialogDescription className="flex">
                        Hier können Sie Fälle einem anderen Ausbruch zuordnen. Ziehen Sie dafür einfach den
                        enstsprechenden Fall in die jeweilige Tabelle.
                    </DialogDescription>
                </DialogHeader>
                <Suspense
                    fallback={
                        <div className="flex h-full w-full justify-center items-center">
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <CaseAssignment registerCaseForDatabaseUpdate={registerCaseForDatabaseUpdate} />
                </Suspense>

                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                        Abbrechen
                    </Button>
                    <Button type="button" onClick={saveAssignment}>
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
