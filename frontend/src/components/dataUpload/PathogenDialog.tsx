import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PathogenSwitch } from "../dashboard/PathogenSwitch";
import { useAppStore } from "@/stores/app";

export function PathogenDialog() {
    const activePathogen = useAppStore((state) => state.activePathogen);

    if (activePathogen) {
        return;
    }

    return (
        <Dialog defaultOpen>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Pathogen auswählen</DialogTitle>
                    <DialogDescription>
                        Für welches Pathogen möchten sie Ausbruchanalysen durchführen?
                    </DialogDescription>
                </DialogHeader>
                <PathogenSwitch />
            </DialogContent>
        </Dialog>
    );
}
