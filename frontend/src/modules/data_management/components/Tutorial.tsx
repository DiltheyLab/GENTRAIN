import { Button } from "@/modules/core/components/ui/Button";
import { importDataFromJson } from "@/modules/core/helpers/database";
import { dbManager } from "@/modules/core/services/database/DatabaseManager";
import { useNavigate } from "react-router-dom";
import ExampleImport from "@/data/gentrain_example.json";
import { useTutorialStore } from "@/modules/tutorial/stores/tutorial";

export const Tutorial = () => {
    const changeTutorialTourIsActive = useTutorialStore((state) => state.changeTutorialTourIsActive);
    const changeTutorialIsRunning = useTutorialStore((state) => state.changeTutorialIsRunning);

    const navigate = useNavigate();

    const initTutorial = () => {
        navigate("/");
        window.scrollTo(0, 0);
        dbManager.switchDatabase("gentrain_example");
        importDataFromJson(new Blob([JSON.stringify(ExampleImport)], { type: "application/json" }));
        changeTutorialIsRunning(true);
        changeTutorialTourIsActive(true);
    };

    return (
        <div data-tutorial-tour-step="data-management-tutorial" className="bg-white rounded-xl p-3">
            <h2 className="text-2xl font-bold tracking-tight">Tutorial starten</h2>
            <p className="text-muted-foreground mb-4">
                Hier können Sie ein Tutorial starten, das Sie durch die Anwendung führt und Ihnen alle wichtigen
                Funktionen erklärt. Sie können das Tutorial jederzeit beenden.
            </p>
            <Button onClick={initTutorial} className="w-fit">
                Tutorial starten
            </Button>
        </div>
    );
};
