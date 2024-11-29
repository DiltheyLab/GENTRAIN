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
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { handleOutbreakError } from "@/modules/core/helpers/errors";
import { useState } from "react";
import { CaseAssignment } from "./CaseAssignment";
import { UndoIcon } from "lucide-react";

export const AssignCasesToOutbreakDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    const saveAssignment = () => {};

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Fälle einem Ausbruch zuordnen</Button>
            </DialogTrigger>
            <DialogContent className="max-w-none w-[calc(100vw-100px)] h-[calc(100vh-100px)]">
                <DialogHeader>
                    <DialogTitle>Fälle einem Ausbruch zuordnen</DialogTitle>
                    <DialogDescription>Hier können Sie Fälle einem Ausbruch zuordnen.</DialogDescription>
                </DialogHeader>
                <CaseAssignment />
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
