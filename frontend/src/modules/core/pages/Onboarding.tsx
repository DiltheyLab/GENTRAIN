import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenSwitch } from "@/modules/core/components/ui/PathogenSwitch";
import { Button } from "@/modules/core/components/ui/Button";
import { Share2 } from "lucide-react";

export function Onboarding() {
    const initSession = useCoreStore((state) => state.initSession);

    const handleClick = () => {
        initSession();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-[30px]">Willkommen bei</h1>
                <div className="flex items-center text-primary">
                    <Share2 className="w-16 h-16 mr-2" /> <span className="text-[60px]">Gentrain</span>
                </div>
            </div>
            <div className="text-center w-1/3 mb-4">
                <p>
                    Das Gentrain Dashboard ermöglicht Ausbruchsanalysen auf Basis von Kontaktnachverfolgung und
                    genetischen Distanzen. Es können Ausbruchsanalysen für virale und bakterielle Pathogene durchgeführt
                    werden.
                </p>
            </div>
            <div className="text-center w-1/3 mb-8">
                <p>
                    Bitte wählen Sie zunächst das Pathogen aus, für welches Sie Ausbruchsanalysen durchführen möchten.
                </p>
            </div>

            <div className="flex">
                <PathogenSwitch />
                <Button onClick={() => handleClick()} className="ml-2">
                    Zum Dashboard
                </Button>
            </div>
        </div>
    );
}
