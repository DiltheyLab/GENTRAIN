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
import { useToast } from "@/modules/core/components/ui/UseToast";
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

export const AnalysisCreation = () => {
    const [analysisName, setAnalysisName] = useState("");
    const analyses = useGetOutbreakAnalysesForActivePathogen();
    const { activePathogen } = useCoreStore();
    const { toast } = useToast();
    const navigate = useNavigate();
    const updateWholeAnalysis = useOutbreakAnalysisStore((state) => state.updateWholeAnalysis);

    const isUniqueName = () => {
        return analyses?.find((analysis) => analysis.name === analysisName) === undefined;
    };

    const nameLengthIsValid = () => {
        return analysisName.length > 0 && analysisName.length < 100;
    };

    const analyseNameIsValid = () => {
        return nameLengthIsValid() && isUniqueName();
    };

    const safeAnalysis = async () => {
        if (!activePathogen) {
            navigate("/");
            toast({
                title: "Fehler beim Speichern der Analyse",
                description: "Die Analyse konnte nicht gespeichert werden. Bitte wählen Sie zunächst ein Pathogen aus.",
                duration: 10000,
            });
            console.error("Error while saving analysis");
            return;
        }
        try {
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
            toast({
                title: "Fehler beim Speichern der Analyse",
                description: "Die Analyse konnte nicht gespeichert werden. Bitte versuche es erneut.",
                duration: 10000,
            });
            console.error("Error while saving analysis", error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary">Neue Analyse erstellen</Button>
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
                    />
                </div>
                {!isUniqueName() && (
                    <p className="text-red-500 text-sm -mt-2">
                        Der Name der Analyse ist bereits vergeben. Bitte wählen Sie einen anderen.
                    </p>
                )}
                <DialogFooter>
                    <Button type="button" disabled={!analyseNameIsValid()} onClick={() => safeAnalysis()}>
                        Speichern und Analyse starten
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
