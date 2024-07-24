import { useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useGetAllAnalyses } from "@/hooks/database/analyses/useGetAllAnalyses";
import { useAnalysisStore } from "@/stores/analysis";
import { AnalysisSchema } from "@/database/analyses";
import { X } from "lucide-react";
import { db } from "@/database/db";

type AnalysisSelectionProps = {
    changeIsOpen: () => void;
};

export const AnalysisSelection = ({ changeIsOpen }: AnalysisSelectionProps) => {
    const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisSchema | undefined>();
    const analyses = useGetAllAnalyses();
    const analysisStore = useAnalysisStore();

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
        changeIsOpen();
    };

    const deleteAnalysis = async (id: number) => {
        try {
            await db.analyses.delete(id);
            if (selectedAnalysis?.id === id) {
                setSelectedAnalysis(undefined);
            }
        } catch (error) {
            console.error(error);
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
                            <SelectItem value={analysis.id.toString()}>{analysis.name}</SelectItem>
                            <Button type="button" variant="ghost" size="sm" onClick={() => deleteAnalysis(analysis.id)}>
                                <X size={15} />
                            </Button>
                        </div>
                    );
                })}
            </SelectGroup>
        );
    };
    return (
        <div className="flex flex-col w-1/2 gap-2">
            <Label htmlFor="name">Vorhandene Analyse auswählen:</Label>
            <Select onValueChange={(value) => changeSelectedAnalysis(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Analyse auswählen" />
                </SelectTrigger>
                <SelectContent>{getSelectionGroups()}</SelectContent>
            </Select>
            <Button type="button" disabled={!selectedAnalysis} onClick={() => handleSubmit()}>
                Analyse starten
            </Button>
        </div>
    );
};
