import { Button } from "@/modules/core/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/modules/core/components/ui/Dialog";
import { Input } from "@/modules/core/components/ui/Input";
import { Label } from "@/modules/core/components/ui/Label";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { cn } from "@/modules/core/helpers/cn";
import { handleOutbreakError } from "@/modules/core/helpers/errors";
import { useCoreStore } from "@/modules/core/stores/core";
import { validateName } from "@/modules/core/helpers/validateName";
import { useState } from "react";
import { useGetOutbreaksForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksForActivePathogen";
import { createOutbreak } from "@/modules/core/models/outbreaks";

export const AssignCasesToOutbreakDialog = () => {
    const [outbreakName, setOutbeakName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const analyses = useGetOutbreaksForActivePathogen();
    const { activePathogen } = useCoreStore();
    const { analyseNameIsValid, isUniqueName } = validateName(analyses, outbreakName);

    const createNewOutbreak = async () => {
        try {
            setIsTouched(false);
            if (!activePathogen) {
                throw new GentrainException("PathogenNotSelected");
            }
            await createOutbreak(outbreakName, activePathogen.id);
        } catch (error) {
            setIsOpen(false);
            handleOutbreakError(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Neuen Ausbruch erstellen</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ausbruch anlegen</DialogTitle>
                    <DialogDescription>Hier können Sie einen neue Ausbruch erstellen.</DialogDescription>
                </DialogHeader>
                <div className="flex gap-5 items-center mt-4">
                    <Label htmlFor="name" className="font-normal">
                        Name
                    </Label>
                    <Input
                        id="name"
                        className={cn("w-full", !isUniqueName() && "focus-visible:ring-red-500")}
                        value={outbreakName}
                        placeholder="Analysename"
                        onChange={(e) => setOutbeakName(e.target.value)}
                        onFocus={() => setIsTouched(true)}
                        autoFocus
                    />
                </div>
                {isTouched && !isUniqueName() && (
                    <p className="text-red-500 text-sm -mt-2">
                        Der Name des Ausbruchs ist bereits vergeben. Bitte wählen Sie einen anderen.
                    </p>
                )}
                <DialogFooter>
                    <Button type="button" disabled={!analyseNameIsValid()} onClick={createNewOutbreak}>
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
