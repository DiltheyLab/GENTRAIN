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
import { handleError } from "@/modules/core/helpers/errors";
import { useGetOutbreaksForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksForActivePathogen";
import { Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { validateOutbreakName } from "../../helpers/outbreakNameValidation";
import { OutbreakSchema, updateOutbreakName } from "@/modules/core/models/outbreaks";
import { useCoreStore } from "@/modules/core/stores/core";

type OutbreakEditDialogProps = {
    row: Row<OutbreakSchema>;
};

export const OutbreakEditDialog = ({ row }: OutbreakEditDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [outbreakName, setOutbreakName] = useState(row.original.name);
    const [isTouched, setIsTouched] = useState(false);
    const outbreaks = useGetOutbreaksForActivePathogen();
    const { outbreakNameNotValid, isUniqueName } = validateOutbreakName(
        outbreaks?.filter((outbreak) => outbreak.name !== row.original.name),
        outbreakName
    );

    const updateCasesWithRelationships = useCoreStore((state) => state.updateCasesWithRelationships);

    const updateOutbreak = async () => {
        try {
            const outbreakId = await updateOutbreakName(row.original.id, outbreakName);
            if (!outbreakId) {
                throw new GentrainException("OutbreakIdIsNotInDB");
            }
        } catch (error) {
            handleError(error, "outbreak");
        } finally {
            setIsOpen(false);
            updateCasesWithRelationships();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size={"icon"} variant={"secondary"}>
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ausbruch bearbeiten</DialogTitle>
                    <DialogDescription>
                        Nehmen Sie hier Änderungen an dem Ausbruch vor. Klicken Sie auf Speichern, wenn Sie fertig sind.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-5 items-center mt-4">
                    <Label htmlFor="name" className="font-normal">
                        Name
                    </Label>
                    <Input
                        id="name"
                        className={cn("w-full", !isUniqueName() && "focus-visible:ring-red-500")}
                        value={outbreakName}
                        placeholder={row.original.name}
                        onChange={(e) => {
                            setOutbreakName(e.target.value);
                        }}
                        onFocus={() => setIsTouched(true)}
                        onBlur={() => setIsTouched(false)}
                    />
                </div>
                {isTouched && !isUniqueName() && (
                    <p className="text-red-500 text-sm -mt-2">
                        Der Name des Ausbruchs ist bereits vergeben. Bitte wählen Sie einen anderen.
                    </p>
                )}
                <DialogFooter>
                    <Button type="submit" disabled={!outbreakNameNotValid()} onClick={updateOutbreak}>
                        Änderungen speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
