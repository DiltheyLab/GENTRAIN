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
        <div className="min-h-screen flex flex-col items-center justify-center py-10">
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
                    {import.meta.env.VITE_APP_URL === "public.gentrain.bi.denbi.de" && (
                        <div className="p-6 rounded-lg border-2 border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-900/10 w-full">
                            <h3 className="font-bold text-lg mb-3 text-yellow-800 dark:text-yellow-200 flex gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                Hinweis zur Nutzung der öffentlichen Instanz
                            </h3>
                            <p className="text-sm text-left text-yellow-900 dark:text-yellow-100">
                                Diese öffentliche Instanz von GENTRAIN dient zu Demonstrations- und Testzwecken. Das
                                Importieren personenbezogener Daten erfolgt auf eigene Verantwortung.
                            </p>
                        </div>
                    )}
                </div>
                <div className="mt-20">
                    <PartnerLogos />
                </div>
            </div>
        </div>
    );
}
