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
import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { cn } from "@/modules/core/helpers/cn";
import { handleError } from "@/modules/core/helpers/errors";
import { validateName } from "@/modules/core/helpers/validateName";
import { useGetOutbreaksForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksForActivePathogen";
import { createOutbreak } from "@/modules/core/models/outbreaks";
import { useCoreStore } from "@/modules/core/stores/core";
import { CustomNode } from "@/modules/core/types/graph";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

type ClusterToOutbreakDialogProps = {
    cluster: Array<CustomNode | undefined>;
    clusterName: string;
};

export const ClusterToOutbreakDialog = ({ cluster, clusterName }: ClusterToOutbreakDialogProps) => {
    const [outbreakName, setOutbeakName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const outbreaks = useGetOutbreaksForActivePathogen();
    const { activePathogen } = useCoreStore();
    const { isNameValid, isUniqueName } = validateName(outbreaks, outbreakName);
    const { toast } = useToast();

    const createNewOutbreak = async () => {
        try {
            setIsTouched(false);
            if (!activePathogen) {
                throw new GentrainException("PathogenNotSelected");
            }
            await createOutbreak(outbreakName, activePathogen.id);
            setIsOpen(false);
            toast({
                title: "Ausbruch angelegt",
                description: `Der Ausbruch ${outbreakName} wurde erfolgreich angelegt.`,
                variant: "success",
                duration: 5000,
            });
        } catch (error) {
            setIsOpen(false);
            handleError(error, "outbreak");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className=" top-0" asChild>
                <Button className="h-9" variant="secondary" size="sm">
                    Ausbruch generieren
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[455px]">
                <DialogHeader>
                    <DialogTitle>Ausbruch aus "{clusterName}" generieren</DialogTitle>
                    <DialogDescription>
                        Hier können Sie einen neuen Ausbruch erstellen und diesem alle Fälle aus dem ausgewählten
                        Cluster zuweisen.
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
                        placeholder="Ausbruchsname"
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
                <div className="flex p-2 bg-gray-100 rounded-lg shadow-md  items-center justify-between space-x-3">
                    <AlertTriangle size={72} />
                    <p className="text-sm font-semibold">
                        Achtung! Allen Fällen aus dem ausgewählten Cluster wird nach diesem Vorgang der neu erstellte
                        Ausbruch zugewiesen. Diese Operation kann nicht rückgängig gemacht werden.
                    </p>
                </div>
                <DialogFooter>
                    <Button type="button" disabled={!isNameValid()} onClick={createNewOutbreak}>
                        Speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
