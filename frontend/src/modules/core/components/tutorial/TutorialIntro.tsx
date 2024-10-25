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
    const tutorialIntroIsActive = useCoreStore((state) => state.tutorialIntroIsActive);
    const changeTutorialIntroIsActive = useCoreStore((state) => state.changeTutorialIntroIsActive);
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);

    const startTutorialTour = () => {
        changeTutorialIntroIsActive(false);
        changeTutorialTourIsActive(true);
    };

    const skipTutorialTour = () => {
        changeTutorialIntroIsActive(false);
        changeTutorialTourIsActive(false);
    };

    return (
        <Dialog open={tutorialIntroIsActive} onOpenChange={changeTutorialIntroIsActive}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="flex text-2xl text-primary items-center">
                        Willkommen bei GENTRAIN
                    </DialogTitle>
                    <DialogDescription className="text-md font-normal text-black">
                        Dieses Tutorial führt Sie durch die wichtigsten Funktionen der Software und zeigt Ihnen, wie Sie
                        GENTRAIN effektiv nutzen können. Sie können das Tutorial jederzeit beenden.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={skipTutorialTour}>
                        Tutorial überspringen
                    </Button>
                    <Button onClick={startTutorialTour}>Starten</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
