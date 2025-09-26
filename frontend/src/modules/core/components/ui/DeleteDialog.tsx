import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./AlertDialog";

type DeleteDialogProps = {
    deleteAction: () => void;
    dialogTitle: string;
    dialogDescription: string;
    triggerComponent: React.ReactNode;
};

export function DeleteDialog({ deleteAction, dialogTitle, dialogDescription, triggerComponent }: DeleteDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild className="w-fit">
                {React.isValidElement(triggerComponent) ? triggerComponent : <>{triggerComponent}</>}
            </AlertDialogTrigger>
            <AlertDialogContent className="z-[105]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
                    <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAction()}>Löschen</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
