import { useState } from "react";
import { Label } from "@/modules/core/components/ui/Label";
import { Input } from "@/modules/core/components/ui/Input";
import { Button } from "@/modules/core/components/ui/Button";
import {
    defaultGraphSettings,
    getDefaultSettings,
    useOutbreakAnalysisStore,
} from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { useNavigate } from "react-router-dom";
import { useGetAnalysesForActivePathogen } from "@/modules/core/hooks/database/analyses/useGetAnalysesForActivePathogen";
import { useCoreStore } from "@/modules/core/stores/core";
import { createAnalysis } from "@/modules/core/models/analyses";

export const AnalysisForm = () => {
    const [analysisName, setAnalysisName] = useState("");
    const analyses = useGetAnalysesForActivePathogen();
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
            const defaultSettings = getDefaultSettings();
            const id = await createAnalysis(analysisName, activePathogen.id, defaultSettings, defaultGraphSettings);
            updateWholeAnalysis(id, analysisName, defaultSettings, defaultGraphSettings);
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
        <div className="flex flex-col w-1/2 gap-2">
            <Label htmlFor="name" className="font-normal">
                Neue Analyse anlegen:
            </Label>
            <Input
                id="name"
                className="w-full"
                value={analysisName}
                placeholder="Analyse 1"
                onChange={(e) => setAnalysisName(e.target.value)}
            />
            {!isUniqueName() && (
                <p className="text-red-500 text-sm">
                    Der Name der Analyse ist bereits vergeben. Bitte wählen Sie einen anderen.
                </p>
            )}
            <Button type="button" disabled={!analyseNameIsValid()} onClick={() => safeAnalysis()}>
                Speichern und Analyse starten
            </Button>
        </div>
    );
};
