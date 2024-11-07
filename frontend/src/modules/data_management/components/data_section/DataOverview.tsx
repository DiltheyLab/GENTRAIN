import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { Separator } from "@/modules/core/components/ui/Separator";
import { CaseSection } from "./CaseSection";
import { GroupSection } from "./GroupSection";
import { useCoreStore } from "@/modules/core/stores/core";
import { deleteDataForPathogen } from "@/modules/core/models/pathogens";
import { useState } from "react";
import { OutbreakSection } from "./OutbreakSection";
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

    if (!casesData || !activePathogen) return null;

    return (
        <>
            <Separator />
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight mb-4">
                        Importierte Daten zu {activePathogen.name}
                    </h2>
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
                <CaseSection />
            </div>
            <OutbreakSection />
            <GroupSection />
        </>
    );
};
