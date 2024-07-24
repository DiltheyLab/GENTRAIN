import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { defaultSettings, useAnalysisStore } from "@/stores/analysis";
import { useToast } from "../ui/use-toast";
import { createAnalysis } from "@/database/analyses";
import { useGetAllAnalyses } from "@/hooks/database/analyses/useGetAllAnalyses";

type AnalysisFormProps = {
    changeIsOpen: () => void;
    isOpen: boolean;
};

export const AnalysisForm = ({ changeIsOpen, isOpen }: AnalysisFormProps) => {
    const [analysisName, setAnalysisName] = useState("");
    const analysisStore = useAnalysisStore();
    const analyses = useGetAllAnalyses();
    const { toast } = useToast();

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
        try {
            //create a new analysis in db and update the name in the store
            const id = await createAnalysis(analysisName, defaultSettings);
            analysisStore.updateName(analysisName);
            analysisStore.updateId(id);
            analysisStore.updateSettings(defaultSettings);
            //close the dialog after saving the analysis
            changeIsOpen();
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
            <Label htmlFor="name">Neue Analyse anlegen:</Label>
            <Input
                id="name"
                className="w-full"
                value={analysisName}
                placeholder="Analyse 1"
                onChange={(e) => setAnalysisName(e.target.value)}
            />
            {!isUniqueName() && isOpen && (
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
