import { Button } from "@/modules/core/components/ui/Button";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { toast } from "@/modules/core/components/ui/UseToast";
import { OutbreakSelection } from "./outbreak_selection/OutbreakSelection";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { handleError } from "@/modules/core/helpers/errors";
import { BackgroundSelection } from "./background_selection/BackgroundSelection";
import { BackgroundFilter } from "./background_filter/BackgroundFilter";
import { ContactTracing } from "./contact_tracing/ContactTracing";
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
import { lazy, Suspense, useState } from "react";
import { Dialog, DialogTrigger } from "@/modules/core/components/ui/Dialog";

const PdfExportConfiguration = lazy(() => import("../pdf_export/PdfExportConfiguration"));

export const Settings = () => {
    const [showPdfExportDialog, setShowPdfExportDialog] = useState(false);
    const outbreakAnalysisStore = useOutbreakAnalysisStore();
    const safeAnalysis = async () => {
        try {
            if (!outbreakAnalysisStore.id) throw new GentrainException("AnalysisIdIsNotInStore");
            const analysisSettingsId = await updateAnalysisSettings(
                outbreakAnalysisStore.id,
                outbreakAnalysisStore.settings,
                outbreakAnalysisStore.graphSettings
            );

            if (analysisSettingsId) {
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
        <form className="w-full px-1 flex flex-col justify-between overflow-y-hidden h-full">
            <fieldset className="flex border rounded-lg flex-col h-[calc(100%-102px)] mb-4 gap-3 px-3 pb-4 pt-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#CCC]">
                <Accordion
                    type="multiple"
                    className="w-full flex flex-col gap-2"
                    defaultValue={outbreakAnalysisStore.settings.openAccordionItems}
                    onValueChange={(value) => outbreakAnalysisStore.updateSettings({ openAccordionItems: value })}
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="flex w-full justify-between items-center">
                            <SectionHeader
                                step={1}
                                title="Ausbruch auswählen"
                                tooltipContent={tooltipOutbreakSelection}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <OutbreakSelection />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" disabled={!outbreakAnalysisStore.settings.selectedOutbreak}>
                        <AccordionTrigger className="flex w-full justify-between items-center disabled:hover:no-underline">
                            <SectionHeader
                                step={2}
                                title="Background auswählen"
                                tooltipContent={tooltipBackgroundSelection}
                                disabled={!outbreakAnalysisStore.settings.selectedOutbreak}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <BackgroundSelection />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" disabled={!outbreakAnalysisStore.settings.selectedOutbreak}>
                        <AccordionTrigger className="flex w-full justify-between items-center disabled:hover:no-underline">
                            <SectionHeader
                                step={3}
                                title="Background filtern"
                                tooltipContent={tooltipBackgroundFilter}
                                disabled={
                                    !outbreakAnalysisStore.settings.selectedOutbreak ||
                                    outbreakAnalysisStore.settings.backgroundType === "none"
                                }
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <BackgroundFilter disabled={outbreakAnalysisStore.settings.backgroundType === "none"} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" disabled={!outbreakAnalysisStore.settings.selectedOutbreak}>
                        <AccordionTrigger className="flex w-full justify-between items-center disabled:hover:no-underline">
                            <SectionHeader
                                step={4}
                                title="Kontaktnachverfolgung"
                                tooltipContent={tooltipContactTracing}
                                disabled={!outbreakAnalysisStore.settings.selectedOutbreak}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <ContactTracing />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5" disabled={!outbreakAnalysisStore.settings.selectedOutbreak}>
                        <AccordionTrigger className="flex w-full justify-between items-center disabled:hover:no-underline">
                            <SectionHeader
                                step={5}
                                title="Einfärbung"
                                tooltipContent={tooltipColorSelection}
                                disabled={!outbreakAnalysisStore.settings.selectedOutbreak}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <ColorSelection />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </fieldset>
            <fieldset className="flex flex-col justify-evenly gap-3 p-3 border rounded-lg h-[102px]">
                <Suspense
                    fallback={
                        <Button disabled variant="outline" type="button">
                            Ausbruchsanalyse-Report exportieren
                        </Button>
                    }
                >
                    <Dialog open={showPdfExportDialog} onOpenChange={(value) => setShowPdfExportDialog(value)}>
                        <DialogTrigger asChild>
                            <Button className="text-wrap w-full" variant="outline" type="button">
                                Ausbruchsanalyse-Report exportieren
                            </Button>
                        </DialogTrigger>
                        {showPdfExportDialog && (
                            <PdfExportConfiguration onPdfExport={() => setShowPdfExportDialog(false)} />
                        )}
                    </Dialog>
                </Suspense>
                <Button type="button" onClick={() => safeAnalysis()}>
                    Analyse speichern
                </Button>
            </fieldset>
        </form>
    );
};
