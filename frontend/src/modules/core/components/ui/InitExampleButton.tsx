import { useCoreStore } from "@/modules/core/stores/core";
import { Button } from "@/modules/core/components/ui/Button";
import ExampleImport from "@/data/gentrain_example.json";
import { importDataFromJson } from "@/modules/core/helpers/database";
import { dbManager } from "../../services/database/DatabaseManager";

export default function InitExampleButton() {
    const initSession = useCoreStore((state) => state.initSession);
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);
    const changeTutorialIsRunning = useCoreStore((state) => state.changeTutorialIsRunning);
    const setPathogenIsLoading = useCoreStore((state) => state.setPathogenIsLoading);

    return (
        <Button
            onClick={async () => {
                dbManager.switchDatabase("gentrain_example");
                setPathogenIsLoading(true);
                try {
                    await importDataFromJson(new Blob([JSON.stringify(ExampleImport)], { type: "application/json" }));
                    await initSession();
                    changeTutorialIsRunning(true);
                    changeTutorialTourIsActive(true);
                } finally {
                    setPathogenIsLoading(false);
                }
            }}
        >
            Beispielszenario starten
        </Button>
    );
}
