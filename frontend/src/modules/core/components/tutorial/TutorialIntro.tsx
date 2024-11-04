import { useCoreStore } from "@/modules/core/stores/core";
import { Button } from "@/modules/core/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";

export const TutorialIntro = () => {
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    const tutorialIsRunnung = useCoreStore((state) => state.tutorialIsRunning);
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);
    const changeTutorialIsRunning = useCoreStore((state) => state.changeTutorialIsRunning);

    return (
        <Dialog open={tutorialTourIsActive && !tutorialIsRunnung} onOpenChange={changeTutorialTourIsActive}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="flex text-2xl text-primary items-center">
                        Willkommen bei GENTRAIN
                    </DialogTitle>
                    <DialogDescription className="text-md font-normal text-black">
                        Dieses Tutorial führt Sie durch die wichtigsten Funktionen der Software und zeigt Ihnen, wie Sie{" "}
                        <strong>GENTRAIN</strong> effektiv nutzen können. Sie können das Tutorial jederzeit beenden.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => changeTutorialTourIsActive(false)}>
                        Tutorial überspringen
                    </Button>
                    <Button onClick={() => changeTutorialIsRunning(true)}>Starten</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
