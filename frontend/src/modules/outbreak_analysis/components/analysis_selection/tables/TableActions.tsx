import { Button } from "@/modules/core/components/ui/Button";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { Row } from "@tanstack/react-table";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EditAnalysisDialog } from "./EditAnalysisDialog";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { DeleteAnalysisDialog } from "./DeleteAnalysisDialog";

type TableActionsProps = {
    row: Row<AnalysisSchema>;
};

export const TableActions = ({ row }: TableActionsProps) => {
    const navigate = useNavigate();
    const updateWholeAnalysis = useOutbreakAnalysisStore((state) => state.updateWholeAnalysis);

    const startAnalysis = () => {
        const { id, name, analysisSettings, graphSettings, generalSettings } = row.original;
        updateWholeAnalysis(id, name, analysisSettings, graphSettings, generalSettings);
        navigate(`${row.original.id}`);
    };

    return (
        <div className="mx-auto">
            <div className="w-fit flex gap-3" data-tutorial-tour-step="outbreak-analysis-overview-start">
                <Button variant={"secondary"} onClick={startAnalysis}>
                    <Play size={15} className="mr-2" /> Analyse starten
                </Button>
                <EditAnalysisDialog row={row} />
                <DeleteAnalysisDialog row={row} />
            </div>
        </div>
    );
};
