import { useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useAnalysisStore } from "@/stores/analysis";
import { AnalysisSchema } from "@/database/analyses";
import { X } from "lucide-react";
import { db } from "@/database/db";
import { useToast } from "../ui/use-toast";
import { DeleteDialog } from "../ui/deleteDialog";
import { useGetAnalysesForActivePathogen } from "@/hooks/database/analyses/useGetAnalysesForActivePathogen";

type AnalysisSelectionProps = {
    changeIsOpen: () => void;
};

export const AnalysisSelection = ({ changeIsOpen }: AnalysisSelectionProps) => {
    const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisSchema | undefined>();
    const analyses = useGetAnalysesForActivePathogen();
    const analysisStore = useAnalysisStore();
    const { toast } = useToast();

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
