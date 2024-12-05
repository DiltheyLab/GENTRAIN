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
import { useGetOutbreakAnalysesForActivePathogen } from "@/modules/core/hooks/database/outbreakAnalyses/useGetOutbreakAnalysesForActivePathogen";
import { AnalysisSchema, updateAnalysisName } from "@/modules/core/models/analyses";
import { validateName } from "@/modules/core/helpers/validateName";
import { Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { forwardRef, useState } from "react";

type AnalysisEditDialogProps = {
    row: Row<AnalysisSchema>;
};

export const AnalysisEditDialog = forwardRef<HTMLButtonElement, AnalysisEditDialogProps>(({ row }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [analysisName, setAnalysisName] = useState(row.original.name);
    const [isTouched, setIsTouched] = useState(false);
    const analyses = useGetOutbreakAnalysesForActivePathogen();
    const { analyseNameIsValid, isUniqueName } = validateName(
        analyses?.filter((analysis) => analysis.name !== row.original.name),
        analysisName
    );

    const updateAnalysis = async () => {
        try {
            setIsTouched(false);
            const analysisId = await updateAnalysisName(row.original.id, analysisName);
            if (!analysisId) {
                throw new GentrainException("AnalysisIdIsNotInDB");
            }
        } catch (error) {
            handleError(error, "outbreakAnalysis");
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button ref={ref} size={"icon"} variant={"secondary"} title="Analyse bearbeiten">
                    <Pencil size={15} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Analyse bearbeiten</DialogTitle>
                    <DialogDescription>
                        Nehmen Sie hier Änderungen an Ihrer Analyse vor. Klicken Sie auf Speichern, wenn Sie fertig
                        sind.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-5 items-center mt-4">
                    <Label htmlFor="name" className="font-normal">
                        Name
                    </Label>
                    <Input
                        id="name"
                        className={cn("w-full", !isUniqueName() && "focus-visible:ring-red-500")}
                        value={analysisName}
                        placeholder="Analysename"
                        onChange={(e) => {
                            setAnalysisName(e.target.value);
                        }}
                        onFocus={() => setIsTouched(true)}
                        autoFocus
                    />
                </div>
                {isTouched && !isUniqueName() && (
                    <p className="text-red-500 text-sm -mt-2">
                        Der Name der Analyse ist bereits vergeben. Bitte wählen Sie einen anderen.
                    </p>
                )}
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={!analyseNameIsValid()}
                        onClick={updateAnalysis}
                        title="Analyse bearbeiten"
                    >
                        Änderungen speichern
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

AnalysisEditDialog.displayName = "AnalysisEditDialog";
