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
} from "./alert-dialog";

type DeleteDialogProps = {
    deleteAction: () => void;
    dialogTitle: string;
    dialogDescription: string;
    triggerComponent: React.ReactNode;
};

export function DeleteDialog({ deleteAction, dialogTitle, dialogDescription, triggerComponent }: DeleteDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {React.isValidElement(triggerComponent) ? triggerComponent : <>{triggerComponent}</>}
            </AlertDialogTrigger>
            <AlertDialogContent>
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
