import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenSwitch } from "@/modules/core/components/ui/PathogenSwitch";
import { Button } from "@/modules/core/components/ui/Button";
import { Share2 } from "lucide-react";
import { PartnerLogos } from "@/modules/core/components/layout/PartnerLogos";
import ExampleImport from "@/data/gentrain_example.json";
import { importDataFromJson } from "@/modules/core/helpers/database";

export function Onboarding() {
    const initSession = useCoreStore((state) => state.initSession);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    const handleClick = () => {
        initSession();
    };

    const initExampleImport = () => {
        importDataFromJson(new Blob([JSON.stringify(ExampleImport)], { type: "application/json" }));
        initSession();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-10/12 md:w-2/3 lg:w-1/2">
                <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center text-primary">
                        <Share2 className="w-16 h-16 mr-4" /> <span className="text-[80px]">Gentrain</span>
                    </div>
                </div>
                <div className="text-center mb-4">
                    <p>
                        Das Gentrain Dashboard ermöglicht Ausbruchsanalysen auf Basis von Kontaktnachverfolgung und
                        genetischen Distanzen. Es können Ausbruchsanalysen für virale und bakterielle Pathogene
                        durchgeführt werden.
                    </p>
                </div>
                <div className="text-center mb-8">
                    <p>
                        Bitte wählen Sie zunächst das Pathogen aus, für welches Sie Ausbruchsanalysen durchführen
                        möchten.
                    </p>
                </div>

                <div className="flex justify-center mb-16">
                    <PathogenSwitch />
                    <Button disabled={!activePathogen} onClick={() => handleClick()} className="ml-2">
                        Zum Dashboard
                    </Button>
                </div>

                <div className="flex justify-center">
                    <Button onClick={() => initExampleImport()} variant="secondary" className="ml-2">
                        Beispielszenario starten
                    </Button>
                </div>
            </div>
            <div className="mt-20">
                <PartnerLogos />
            </div>
        </div>
    );
}
