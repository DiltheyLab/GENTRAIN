import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/Dialog";
import { PathogenSwitch } from "./ui/PathogenSwitch";
import { useCoreStore } from "../stores/core";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

export const PathogenSelectionDialog = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const [isOpen, setIsOpen] = useState(false);
    const pathogenIsLoading = useCoreStore((state) => state.pathogenIsLoading);

    useEffect(() => {
        if (!activePathogen && !pathogenIsLoading) {
            setIsOpen(true);
        }
    }, [activePathogen, pathogenIsLoading]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                return; //disables that you can close the dialog by pressing esc
            }}
        >
            <DialogContent
                className="w-[350px]"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                hideCloseButton
            >
                <DialogHeader>
                    <DialogTitle>Bitte Pathogen auswählen.</DialogTitle>
                    <DialogDescription>Um fortzufahren müssen Sie ein Pathogen auswählen.</DialogDescription>
                </DialogHeader>

                <PathogenSwitch className="w-[310px]" />

                <DialogFooter>
                    <Button type="button" disabled={!activePathogen} onClick={() => setIsOpen(false)}>
                        Weiter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
