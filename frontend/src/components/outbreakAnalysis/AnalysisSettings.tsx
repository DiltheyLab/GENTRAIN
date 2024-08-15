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
import { exportGraphAndInformationAsPdf } from "@/services/pdf";
import { SectionHeader } from "./SectionHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import {
    tooltipOutbreakSelection,
    tooltipBackgroundSelection,
    tooltipBackgroundFilter,
    tooltipContactTracing,
    tooltipColorSelection,
} from "../tooltips/outbreakAnalysis/tooltips";
import { ColorSelection } from "./colorSelection/ColorSelection";

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
                                        tooltipContent={tooltipOutbreakSelection}
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
                                        tooltipContent={tooltipBackgroundSelection}
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
                                        tooltipContent={tooltipBackgroundFilter}
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
                                        tooltipContent={tooltipContactTracing}
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
                                    <SectionHeader step={5} title="Einfärbung" tooltipContent={tooltipColorSelection} />
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
