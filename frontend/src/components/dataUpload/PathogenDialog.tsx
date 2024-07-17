import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PathogenSwitch } from "../dashboard/PathogenSwitch";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app";

export function PathogenDialog() {
    const [open, setOpen] = useState(false);
    const activePathogen = useAppStore((state) => state.activePathogen);

    useEffect(() => {
        setTimeout(() => {
            if (!useAppStore.getState().activePathogen) {
                setOpen(true);
            }
        }, 50);
    }, []);

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Pathogen auswählen</DialogTitle>
                    <DialogDescription>Für welches Pathogen möchten sie Ausbruchanalyse durchführen?</DialogDescription>
                </DialogHeader>
                <PathogenSwitch />
                <DialogFooter>
                    <Button type="submit" onClick={() => setOpen(false)} disabled={!activePathogen}>
                        Bestätigen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
