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
import { useState } from "react";
import { useGetOutbreakAnalysesForActivePathogen } from "@/modules/core/hooks/database/outbreakAnalyses/useGetOutbreakAnalysesForActivePathogen";
import { createAnalysis } from "@/modules/core/models/analyses";
import { useCoreStore } from "@/modules/core/stores/core";
import { useNavigate } from "react-router-dom";
import {
    useOutbreakAnalysisStore,
    getDefaultAnalysisSettings,
    defaultGraphSettings,
    defaultGeneralSettings,
} from "../../stores/outbreakAnalysis";
import { Label } from "@/modules/core/components/ui/Label";
import { Input } from "@/modules/core/components/ui/Input";
import { cn } from "@/modules/core/helpers/cn";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { handleError } from "@/modules/core/helpers/errors";
import { validateName } from "../../../core/helpers/validateName";

export const AnalysisCreation = () => {
    const [analysisName, setAnalysisName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const analyses = useGetOutbreakAnalysesForActivePathogen();
    const { activePathogen } = useCoreStore();
    const navigate = useNavigate();
    const updateWholeAnalysis = useOutbreakAnalysisStore((state) => state.updateWholeAnalysis);
    const { isNameValid, isUniqueName } = validateName(analyses, analysisName);

    const createAndNavigateToNewAnalysis = async () => {
        try {
            setIsTouched(false);
            if (!activePathogen) {
                throw new GentrainException("PathogenNotSelected");
            }

            const defaultAnalysisSettings = getDefaultAnalysisSettings();
            const id = await createAnalysis(
                analysisName,
                activePathogen.id,
                defaultAnalysisSettings,
                defaultGraphSettings,
                defaultGeneralSettings
            );
            updateWholeAnalysis(
                id,
                analysisName,
                defaultAnalysisSettings,
                defaultGraphSettings,
                defaultGeneralSettings
            );

            navigate(`${id}`);
        } catch (error) {
            setIsOpen(false);
            handleError(error, "outbreakAnalysis");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Neue Analyse erstellen</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Analyse anlegen</DialogTitle>
                    <DialogDescription>Hier können Sie eine neue Analyse erstellen.</DialogDescription>
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
                        onChange={(e) => setAnalysisName(e.target.value)}
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
                    <Button type="button" disabled={!isNameValid()} onClick={createAndNavigateToNewAnalysis}>
                        Speichern und Analyse starten
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
