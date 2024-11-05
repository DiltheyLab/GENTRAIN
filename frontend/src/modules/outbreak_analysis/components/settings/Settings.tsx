import { Button } from "@/modules/core/components/ui/Button";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { OutbreakSelection } from "./outbreak_selection/OutbreakSelection";
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
import { lazy, Suspense, useState } from "react";
import { safeAnalysis } from "../../helpers/safeAnalysis";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger } from "@/modules/core/components/ui/Dialog";

const PdfExportConfiguration = lazy(() => import("../pdf_export/PdfExportConfiguration"));

export const Settings = () => {
    const [showPdfExportDialog, setShowPdfExportDialog] = useState(false);
    const outbreakAnalysisStore = useOutbreakAnalysisStore();
    const navigate = useNavigate();

    return (
        <form className="w-full px-1 flex flex-col justify-between overflow-y-hidden h-full">
            <fieldset className="flex bg-white border rounded-lg flex-col h-[calc(100%-102px)] mb-4 gap-3 px-3 pb-4 pt-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#CCC]">
                <Accordion
                    type="multiple"
                    className="w-full flex flex-col gap-2"
                    defaultValue={outbreakAnalysisStore.generalSettings.openAccordionItems}
                    value={outbreakAnalysisStore.generalSettings.openAccordionItems}
                    onValueChange={(value) =>
                        outbreakAnalysisStore.updateGeneralSettings({ openAccordionItems: value })
                    }
                >
                    <AccordionItem
                        data-tutorial-tour-step="outbreak-analysis-outbreak-selection"
                        value="outbreak-selection"
                    >
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
                    <AccordionItem
                        value="background-selection"
                        disabled={!outbreakAnalysisStore.analysisSettings.selectedOutbreak}
                        data-tutorial-tour-step="outbreak-analysis-background-selection"
                    >
                        <AccordionTrigger className="flex w-full justify-between items-center disabled:hover:no-underline">
                            <SectionHeader
                                step={2}
                                title="Umgebung auswählen"
                                tooltipContent={tooltipBackgroundSelection}
                                disabled={!outbreakAnalysisStore.analysisSettings.selectedOutbreak}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <BackgroundSelection />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                        value="background-filtering"
                        disabled={!outbreakAnalysisStore.analysisSettings.selectedOutbreak}
                        data-tutorial-tour-step="outbreak-analysis-background-filtering"
                    >
                        <AccordionTrigger className="flex w-full justify-between items-center disabled:hover:no-underline">
                            <SectionHeader
                                step={3}
                                title="Umgebung filtern"
                                tooltipContent={tooltipBackgroundFilter}
                                disabled={
                                    !outbreakAnalysisStore.analysisSettings.selectedOutbreak ||
                                    outbreakAnalysisStore.analysisSettings.backgroundType === "none"
                                }
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <BackgroundFilter
                                disabled={outbreakAnalysisStore.analysisSettings.backgroundType === "none"}
                            />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                        value="contact-tracing"
                        disabled={!outbreakAnalysisStore.analysisSettings.selectedOutbreak}
                        data-tutorial-tour-step="outbreak-analysis-contact-tracing"
                    >
                        <AccordionTrigger className="flex w-full justify-between items-center disabled:hover:no-underline">
                            <SectionHeader
                                step={4}
                                title="Kontaktnachverfolgung"
                                tooltipContent={tooltipContactTracing}
                                disabled={!outbreakAnalysisStore.analysisSettings.selectedOutbreak}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <ContactTracing />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                        value="coloring"
                        disabled={!outbreakAnalysisStore.analysisSettings.selectedOutbreak}
                        data-tutorial-tour-step="outbreak-analysis-coloring"
                    >
                        <AccordionTrigger className="flex w-full justify-between items-center disabled:hover:no-underline">
                            <SectionHeader
                                step={5}
                                title="Einfärbung"
                                tooltipContent={tooltipColorSelection}
                                disabled={!outbreakAnalysisStore.analysisSettings.selectedOutbreak}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <ColorSelection />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </fieldset>
            <fieldset className="flex flex-col justify-evenly gap-3 p-3 border rounded-lg h-[102px] bg-white">
                <Suspense
                    fallback={
                        <Button disabled variant="outline" type="button">
                            Ausbruchsanalyse-Report exportieren
                        </Button>
                    }
                >
                    <Dialog open={showPdfExportDialog} onOpenChange={(value) => setShowPdfExportDialog(value)}>
                        <DialogTrigger data-tutorial-tour-step="outbreak-analysis-report-export" asChild>
                            <Button className="text-wrap w-full" variant="outline" type="button">
                                Ausbruchsanalyse-Report exportieren
                            </Button>
                        </DialogTrigger>
                        {showPdfExportDialog && (
                            <PdfExportConfiguration onPdfExport={() => setShowPdfExportDialog(false)} />
                        )}
                    </Dialog>
                </Suspense>
                <Button
                    type="button"
                    onClick={async () => {
                        const isSaved = await safeAnalysis(outbreakAnalysisStore);
                        if (!isSaved) return;
                        navigate("/outbreak-analysis");
                    }}
                >
                    Analyse speichern und beenden
                </Button>
            </fieldset>
        </form>
    );
};
