import { Button } from "@/modules/core/components/ui/Button";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { toast } from "@/modules/core/components/ui/UseToast";
import { OutbreakSelection } from "./outbreak_selection/OutbreakSelection";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { handleError } from "@/modules/core/helpers/errors";
import { BackgroundSelection } from "./background_selection/BackgroundSelection";
import { BackgroundFilter } from "./background_filter/BackgroundFilter";
import { ContactTracing } from "./contact_tracing/ContactTracing";
import { exportGraphAndInformationAsPdf } from "@/modules/outbreak_analysis/helpers/pdf";
import { SectionHeader } from "./SectionHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import {
    tooltipOutbreakSelection,
    tooltipBackgroundSelection,
    tooltipBackgroundFilter,
    tooltipContactTracing,
    tooltipColorSelection,
} from "./Tooltips";
import { ColorSelection } from "./color_selection/ColorSelection";
import { updateAnalysisSettings } from "@/modules/core/models/analyses";

export const Settings = () => {
    const analysisStore = useOutbreakAnalysisStore();

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
        <div className="relative flex flex-col items-center gap-8 overflow-y-hidden">
            <form className="w-full items-start border rounded-xl px-1">
                <fieldset className="flex flex-col gap-3 px-3 pb-4 pt-1 overflow-y-auto h-[85vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#CCC]">
                    <Accordion
                        type="multiple"
                        className="w-full flex flex-col gap-2"
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
                        {analysisStore.settings.selectedOutbreak && (
                            <>
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
                                        <SectionHeader
                                            step={5}
                                            title="Einfärbung"
                                            tooltipContent={tooltipColorSelection}
                                        />
                                        <AccordionTrigger>
                                            <span />
                                        </AccordionTrigger>
                                    </div>
                                    <AccordionContent>
                                        <ColorSelection />
                                    </AccordionContent>
                                </AccordionItem>
                            </>
                        )}
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
                </fieldset>
            </form>
        </div>
    );
};
