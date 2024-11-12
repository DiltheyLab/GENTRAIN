import { useCoreStore } from "@/modules/core/stores/core";
import { Button } from "@/modules/core/components/ui/Button";
import ExampleImport from "@/data/gentrain_example.json";
import { importDataFromJson } from "@/modules/core/helpers/database";

export default function InitExampleButton() {
    const initSession = useCoreStore((state) => state.initSession);

    const initExampleImport = () => {
        importDataFromJson(new Blob([JSON.stringify(ExampleImport)], { type: "application/json" }));
        initSession();
    };

    return (
        <Button onClick={() => initExampleImport()} variant="secondary" className="ml-2">
            Beispielszenario starten
        </Button>
    );
}
