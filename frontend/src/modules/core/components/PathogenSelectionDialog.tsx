import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/Dialog";
import { PathogenSwitch } from "./ui/PathogenSwitch";
import { useCoreStore } from "../stores/core";
import { useState } from "react";
import { Button } from "./ui/Button";

export const PathogenSelectionDialog = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const [isOpen, setIsOpen] = useState(!activePathogen);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[620px]">
                <DialogHeader>
                    <DialogTitle>Bitte Pathogen auswählen.</DialogTitle>
                    <DialogDescription>Um fortzufahren müssen Sie ein Pathogen auswählen.</DialogDescription>
                </DialogHeader>

                <PathogenSwitch />
                <DialogFooter>
                    <Button type="button" disabled={!activePathogen} onClick={() => setIsOpen(false)}>
                        Weiter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
