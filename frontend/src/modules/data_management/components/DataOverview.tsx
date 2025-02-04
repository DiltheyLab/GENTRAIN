import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { Separator } from "@/modules/core/components/ui/Separator";
import { CaseSection } from "./case_section/CaseSection";
import { GroupSection } from "./group_section/GroupSection";
import { useCoreStore } from "@/modules/core/stores/core";
import { deleteDataForPathogen } from "@/modules/core/models/pathogens";
import { useState } from "react";
import { OutbreakSection } from "./outbreak_section/OutbreakSection";
import { Button } from "@/modules/core/components/ui/Button";

export const DataOverview = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const updateCasesWithRelationships = useCoreStore((state) => state.updateCasesWithRelationships);
    const casesData = useCoreStore((state) => state.casesWithRelationships);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteData = async () => {
        if (activePathogen) {
            setIsDeleting(true);
            await deleteDataForPathogen(activePathogen.id);
            await updateCasesWithRelationships();
            setIsDeleting(false);
        }
    };

    if (!casesData || casesData?.length === 0 || !activePathogen) return null;

    return (
        <>
            <div className="p-3">
                <Separator />
            </div>
            <div data-tutorial-tour-step="data-management-case-section" className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight mb-4">
                        Importierte Daten zu {activePathogen.name}
                    </h2>
                </div>
                <CaseSection />
                <DeleteDialog
                    deleteAction={deleteData}
                    dialogTitle="Falldaten löschen"
                    dialogDescription={`Möchten sie die Falldaten zu ${activePathogen.name} wirklich löschen?`}
                    triggerComponent={
                        <Button variant="destructive">
                            {isDeleting ? <LoadingSpinner /> : <>Alle Daten zu {activePathogen.name} löschen</>}
                        </Button>
                    }
                />
            </div>
            <OutbreakSection />
            <GroupSection />
        </>
    );
};
