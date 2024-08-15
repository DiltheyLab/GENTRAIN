import { Button } from "../ui/button";
import { useAnalysisStore } from "@/stores/analysis";
import { updateAnalysisSettings } from "@/database/analyses";
import { toast } from "../ui/use-toast";
import { OutbreakSelection } from "./outbreakSelection/OutbreakSelection";
import { GentrainException } from "@/exceptions/GentrainException";
import { handleError } from "@/services/errors";
import { BackgroundSelection } from "./backgroundSelection/BackgroundSelection";
import { BackgroundFilter } from "./backgroundFilter/BackgroundFilter";
import { ContactTracing } from "./contactTracing/ContactTracing";
import { ColorSelection } from "./ColorSelection";
import { exportGraphAndInformationAsPdf } from "@/services/pdf";
import { SectionHeader } from "./SectionHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export const AnalysisSettings = () => {
    const analysisStore = useAnalysisStore();

    const safeAnalysis = async () => {
        try {
            if (!analysisStore.id) throw new GentrainException("AnalysisIdIsNotInStore");
            const success = await updateAnalysisSettings(
                analysisStore.id,
                analysisStore.settings,
                analysisStore.graphSettings
            );
            if (success) {
                toast({
                    title: "Analyse gespeichert",
                    description: "Die Analyse wurde erfolgreich gespeichert.",
                    duration: 5000,
                });
            } else {
                throw new GentrainException("AnalysisIdIsNotInDB");
            }
        } catch (error) {
            handleError(error);
        }
    };

    const tooltipContentOutbreakSelection = (
        <p>Wählen Sie für die Analyse eines Ausbruchs den enstprechenden Datensatz aus.</p>
    );
    const tooltipContentBackgroundSelection = (
        <p>
            Sie können entweder <u>alle</u> gespeicherten oder <u>bestimmte</u> Falldaten von Ausbrüchen oder Kategorien
            als Background auswählen.
        </p>
    );
    const tooltipContentBackgroundFilter = (
        <p>
            Sie können die in Schritt 2 ausgewählten Falldaten (Background) nach genetisch verwandten Fällen oder einer
            Zeitspanne filtern.
        </p>
    );
    const tooltipContentColorSelection = <p>Sie können hier Einstellungen an der Farbe vornehmen.</p>;
    const tooltipContentContactTracing = (
        <p>Sie können hier die Kontakte, die sie hochgeladen haben, anzeigen lassen.</p>
    );

    return (
        <div className="relative flex-col items-center gap-8 flex min-h-[80vh]" x-chunk="dashboard-03-chunk-0">
            <form className="w-full items-start gap-3">
                <fieldset className="flex flex-col gap-6 rounded-lg border p-4 ">
                    <div className="flex flex-col gap-3">
                        <Accordion
                            type="multiple"
                            className="w-full flex flex-col gap-3"
                            defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]}
                        >
                            <AccordionItem value="item-1">
                                <div className="flex w-full justify-between items-center">
                                    <SectionHeader
                                        step={1}
                                        title="Ausbruch auswählen"
                                        tooltipContent={tooltipContentOutbreakSelection}
                                    />
                                    <AccordionTrigger>
                                        <span />
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent>
                                    <OutbreakSelection />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <div className="flex w-full justify-between items-center">
                                    <SectionHeader
                                        step={2}
                                        title="Background auswählen"
                                        tooltipContent={tooltipContentBackgroundSelection}
                                    />
                                    <AccordionTrigger>
                                        <span />
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent>
                                    <BackgroundSelection />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <div className="flex w-full justify-between items-center">
                                    <SectionHeader
                                        step={3}
                                        title="Background filtern"
                                        tooltipContent={tooltipContentBackgroundFilter}
                                    />
                                    <AccordionTrigger>
                                        <span />
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent>
                                    <BackgroundFilter />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4">
                                <div className="flex w-full justify-between items-center">
                                    <SectionHeader
                                        step={4}
                                        title="Kontaktnachverfolgung"
                                        tooltipContent={tooltipContentContactTracing}
                                    />
                                    <AccordionTrigger>
                                        <span />
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent>
                                    <ContactTracing />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5">
                                <div className="flex w-full justify-between items-center">
                                    <SectionHeader
                                        step={5}
                                        title="Einfärbung"
                                        tooltipContent={tooltipContentColorSelection}
                                    />
                                    <AccordionTrigger>
                                        <span />
                                    </AccordionTrigger>
                                </div>
                                <AccordionContent>
                                    <ColorSelection />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Button
                            className="mt-2"
                            variant="outline"
                            type="button"
                            onClick={() => exportGraphAndInformationAsPdf(analysisStore.name)}
                        >
                            Analysebericht exportieren
                        </Button>
                        <Button type="button" onClick={() => safeAnalysis()}>
                            Analyse speichern
                        </Button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
