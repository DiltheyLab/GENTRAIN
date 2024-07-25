import { Button } from "./button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog";

type DeleteDialogProps = {
    deleteAction: () => void;
    dialogTitle: string;
    dialogDescription: string;
    triggerComponent: React.ReactNode;
};

export function DeleteDialog({ deleteAction, dialogTitle, dialogDescription, triggerComponent }: DeleteDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start mt-5">
                    <Button type="button" variant="destructive" onClick={() => deleteAction()}>
                        Löschen
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Abbrechen
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
