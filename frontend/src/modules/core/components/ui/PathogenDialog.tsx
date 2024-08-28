import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";
import { useCoreStore } from "../../stores/core";
import { PathogenSwitch } from "./PathogenSwitch";

export function PathogenDialog() {
    const activePathogen = useCoreStore((state) => state.activePathogen);

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
