import { useState } from "react";
import { Label } from "@/modules/core/components/ui/Label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/modules/core/components/ui/Select";
import { Button } from "@/modules/core/components/ui/Button";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { X } from "lucide-react";
import { db } from "@/modules/core/infrastructure/database";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { DeleteDialog } from "@/modules/core/components/ui/DeleteDialog";
import { useGetAnalysesForActivePathogen } from "@/modules/core/hooks/database/analyses/useGetAnalysesForActivePathogen";
import { useNavigate } from "react-router-dom";
import { AnalysisSchema } from "@/modules/core/models/analyses";

export const AnalysisSelection = () => {
    const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisSchema | undefined>();
    const analyses = useGetAnalysesForActivePathogen();
    const analysisStore = useOutbreakAnalysisStore();
    const { toast } = useToast();
    const navigate = useNavigate();

    const changeSelectedAnalysis = (id: string) => {
        const selectedAnalysis = analyses?.find((analysis) => analysis.id === +id);
        setSelectedAnalysis(selectedAnalysis);
    };

    const handleSubmit = () => {
        if (!selectedAnalysis) return;
        // update the analysis in the store with the analysis from the database
        analysisStore.updateName(selectedAnalysis.name);
        analysisStore.updateId(selectedAnalysis.id);
        analysisStore.updateSettings(selectedAnalysis.settings);
        analysisStore.updateGraphSettings(selectedAnalysis.graphSettings);
        navigate(`${selectedAnalysis.name}`);
    };

    const deleteAnalysis = async (id: number) => {
        try {
            await db.analyses.delete(id);
            // disable button if the selected analysis is deleted
            if (selectedAnalysis?.id === id) {
                setSelectedAnalysis(undefined);
            }
        } catch (error) {
            toast({
                title: "Fehler beim Löschen der Analyse",
                description: "Die Analyse konnte nicht gelöscht werden. Bitte versuche es erneut.",
                duration: 10000,
                variant: "destructive",
            });
            console.error("Error while deleting analysis", error);
        }
    };

    const getSelectionGroups = () => {
        if (!analyses || analyses.length === 0) {
            return (
                <SelectGroup>
                    <SelectLabel>Keine Analysen gefunden</SelectLabel>
                </SelectGroup>
            );
        }
        return (
            <SelectGroup>
                <SelectLabel>Analysen</SelectLabel>
                {analyses.map((analysis) => {
                    return (
                        <div className="flex flex-row items-center" key={analysis.id}>
                            <SelectItem className="rounded-sm" value={analysis.id.toString()}>
                                {analysis.name}
                            </SelectItem>
                            <DeleteDialog
                                deleteAction={() => deleteAnalysis(analysis.id)}
                                dialogTitle="Analyse löschen"
                                dialogDescription="Möchten sie die Analyse wirklich löschen?"
                                triggerComponent={
                                    <Button type="button" variant="ghost" size="sm" className="h-8 rounded-sm">
                                        <X size={15} />
                                    </Button>
                                }
                            />
                        </div>
                    );
                })}
            </SelectGroup>
        );
    };
    return (
        <div className="flex flex-col w-1/2 gap-2" id="analysis-selection">
            <Label htmlFor="name">Vorhandene Analyse auswählen:</Label>
            <Select onValueChange={(value) => changeSelectedAnalysis(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Analyse auswählen" />
                </SelectTrigger>
                <SelectContent className="z-[103]">{getSelectionGroups()}</SelectContent>
            </Select>
            <Button type="button" disabled={!selectedAnalysis} onClick={() => handleSubmit()}>
                Analyse starten
            </Button>
        </div>
    );
};
