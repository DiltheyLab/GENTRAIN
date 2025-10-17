import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenSwitch } from "@/modules/core/components/ui/PathogenSwitch";
import { Button } from "@/modules/core/components/ui/Button";
import { Dna, GraduationCap } from "lucide-react";
import { PartnerLogos } from "@/modules/core/components/layout/PartnerLogos";
import { lazy, Suspense } from "react";
import GentrainLogo from "@/assets/img/gentrain-logo.svg";

const InitExampleButton = lazy(() => import("@/modules/core/components/ui/InitExampleButton"));

export function Onboarding() {
    const initSession = useCoreStore((state) => state.initSession);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-10/12 md:w-3/4 lg:w-3/4 flex flex-col items-center justify-center text-center">
                <div className="flex items-center text-primary mb-10">
                    <img width={800} src={GentrainLogo} alt="GENTRAIN NRW" />
                </div>
                <p className="font-medium w-11/12">
                    Das GENTRAIN Dashboard ermöglicht Ausbruchsanalysen auf Basis von Kontaktnachverfolgung und
                    genetischen Distanzen. Es können Ausbruchsanalysen für virale und bakterielle Pathogene durchgeführt
                    werden.
                </p>

                <div className="flex mt-8 gap-4 flex-wrap justify-between max-w-[1000px]">
                    <div className="flex flex-col gap-4 px-8 py-10 items-center border-2 rounded-lg border-muted-foreground/10 bg-muted/50 w-full lg:w-[48%]">
                        <h3 className="font-bold tracking-tight text-xl">Tutorial starten</h3>
                        <GraduationCap size={60} />
                        <p className="text-center flex items-center justfy-center flex-1 lg:px-10">
                            Um Ihnen den Einstieg in die Software zu erleichtern, haben wir ein Beispielszenario mit
                            einem Tutorial vorbereitet.
                        </p>
                        <Suspense
                            fallback={
                                <Button className="ml-2" disabled>
                                    Beispielszenario starten
                                </Button>
                            }
                        >
                            <InitExampleButton />
                        </Suspense>
                    </div>
                    <div className="flex flex-col gap-4 p-8 py-10 items-center border-2 rounded-lg border-muted-foreground/10 bg-muted/50 w-full lg:w-[48%]">
                        <h3 className="font-bold tracking-tight text-xl">Anwendung starten</h3>
                        <Dna size={60} />
                        <p className="text-center flex items-center justfy-center flex-1 lg:px-10">
                            Bitte wählen Sie zunächst das Pathogen aus, für welches Sie Ausbruchsanalysen durchführen
                            möchten.
                        </p>
                        <div className="flex justify-center">
                            <PathogenSwitch />
                            <Button disabled={!activePathogen} onClick={initSession} className="ml-2">
                                Starten
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-20">
                    <PartnerLogos />
                </div>
            </div>
        </div>
    );
}
