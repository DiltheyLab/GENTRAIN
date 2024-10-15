import { Button } from "@/modules/core/components/ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/modules/core/components/ui/Tooltip";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { Row } from "@tanstack/react-table";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnalysisEditDialog } from "./AnalysisEditDialog";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { AnalysisDeleteAlertDialog } from "./AnalysisDeleteAlertDialog";

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
        <div className="flex gap-3 mx-auto">
            <Button variant={"secondary"} onClick={startAnalysis}>
                <Play size={15} className="mr-2" /> Analyse starten
            </Button>
            <AnalysisEditDialog row={row} />
            <AnalysisDeleteAlertDialog row={row} />
        </div>
    );
};
