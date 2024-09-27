import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";
import { useEffect, useState } from "react";
import { useCoreStore } from "@/modules/core/stores/core";
import { GraphPdf } from "@/modules/core/components/graph/GraphPdf";
import { Button } from "@/modules/core/components/ui/Button";
import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";
import { Textarea } from "@/modules/core/components/ui/Textarea";
import { PdfDataGenerator } from "../../services/pdf_export/PdfDataGenerator";
import OutbreakAnalysisReportPdf from "./OutbreakAnalysisReportPdf";
import PdfGraphLegend from "./PdfGraphLegend";

const PdfExportConfiguration = ({ onPdfExport }: { onPdfExport: () => void }) => {
    const activePathogen = useCoreStore((state) => state.casesWithRelationships);
    const cases = useCoreStore((state) => state.casesWithRelationships);
    const analysisName = useOutbreakAnalysisStore((state) => state.name);
    const analysisReport = useOutbreakAnalysisStore((state) => state.analysisReport);
    const updateAnalysisReport = useOutbreakAnalysisStore((state) => state.updateAnalysisReport);
    const graphData = useOutbreakAnalysisStore((state) => state.graphData);
    const { charge, colorMap } = useOutbreakAnalysisStore((state) => state.graphSettings);

    const [isExporting, setIsExporting] = useState(false);
    const [graphReadyForExport, setGraphReadyForExport] = useState(false);
    const pdfDataGenerator = new PdfDataGenerator();
    const [graphImageUrl, setGraphImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (graphReadyForExport) {
            pdfDataGenerator.generateGraphImage().then((graphImageUrl: string) => {
                setGraphImageUrl(graphImageUrl);
            });
        }
    }, [graphReadyForExport]);

    const downloadPdf = () => {
        setIsExporting(true);
        if (
            !graphData ||
            !activePathogen ||
            !analysisName ||
            !graphImageUrl ||
            !analysisReport.summary ||
            !analysisReport.conclusion
        )
            return;

        const fileName = `${analysisName}_report.pdf`;
        pdf(<OutbreakAnalysisReportPdf pdfDataGenerator={pdfDataGenerator} graphImageUrl={graphImageUrl} />)
            .toBlob()
            .then((blob) => {
                saveAs(blob, fileName);
                setIsExporting(false);
                setGraphReadyForExport(false);
                onPdfExport();
            });
    };

    return (
        <>
            <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)] px-0">
                <DialogHeader className="px-6 text-left">
                    <DialogTitle className="mb-5">Ausbruchsanalyse-Report zu "{analysisName}"</DialogTitle>
                    <DialogDescription>
                        Exportieren Sie einen Ausbruchsanalyse-Report aus Basis der unten aufgeführten Inhalte. Die
                        generierten Inhalte können über die Textfelder verändert werden.
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-scroll max-h-[70vh] px-6">
                    <div className="z-[-1] overflow-hidden relative">
                        <div className="absolute top-0 left-0 pdf-graph">
                            <GraphPdf
                                data={structuredClone(graphData)}
                                width={1200}
                                height={900}
                                colorMap={colorMap}
                                cases={cases}
                                charge={charge}
                                linkDistance={50}
                                nodeSize={10}
                                linkWidth={2}
                                exportPdfOnEngineStop={() => setGraphReadyForExport(true)}
                            />
                        </div>
                        <div className="absolute w-full h-full top-0 left-0 bg-white"></div>
                    </div>
                    <div className="mb-5">
                        <div className="mb-2">
                            <p className="font-bold">Zusammenfassung des Datensatzes</p>
                            <small>
                                Verwenden Sie die automatisch vorformulierte Zusammenfassung des Datensatzes oder
                                bearbeiten Sie diese im Textfeld.
                            </small>
                        </div>
                        <Textarea
                            className="p-5 resize-none overflow-hidden"
                            defaultValue={pdfDataGenerator.generateSummary()}
                            autoFocus
                            onFocus={(evt) => {
                                evt.currentTarget.style.height = "";
                                evt.currentTarget.style.height = evt.currentTarget.scrollHeight + "px";
                                updateAnalysisReport({ summary: evt.target.value });
                            }}
                            onChange={(evt) => {
                                evt.currentTarget.style.height = "";
                                evt.currentTarget.style.height = evt.currentTarget.scrollHeight + "px";
                                updateAnalysisReport({ summary: evt.target.value });
                            }}
                        />
                    </div>
                    <div className="mb-5">
                        <p className="font-bold">Grafische Darstellung der Struktur der analysierten Fälle</p>
                        {graphImageUrl && (
                            <>
                                <div className="flex w-full md:p-10">
                                    <img src={graphImageUrl} className="w-full md:w-2/3 mx-auto my-5" />
                                    <div className="hidden md:block">
                                        <PdfGraphLegend preview />
                                    </div>
                                </div>
                                <small className="italic">{pdfDataGenerator.getGraphImageDescription()}</small>
                            </>
                        )}
                        {!graphImageUrl && (
                            <div className="flex justify-center my-10">
                                <LoadingSpinner />
                            </div>
                        )}
                    </div>
                    <div className="mb-5">
                        <div className="mb-2">
                            <p className="font-bold">Bewertung</p>
                            <small>
                                Verwenden Sie die automatisch vorformulierte Bewertung oder bearbeiten Sie diese im
                                Textfeld.
                            </small>
                        </div>
                        <Textarea
                            className="p-5 resize-none overflow-hidden"
                            defaultValue={pdfDataGenerator.generateConclusion()}
                            autoFocus
                            onFocus={(evt) => {
                                evt.currentTarget.style.height = "";
                                evt.currentTarget.style.height = evt.currentTarget.scrollHeight + "px";
                                updateAnalysisReport({ conclusion: evt.target.value });
                            }}
                            onChange={(evt) => {
                                evt.currentTarget.style.height = "";
                                evt.currentTarget.style.height = evt.currentTarget.scrollHeight + "px";
                                updateAnalysisReport({ conclusion: evt.target.value });
                            }}
                        />
                    </div>
                </div>
                <DialogFooter className="px-6">
                    <div className="flex justify-end">
                        <Button onClick={() => downloadPdf()} disabled={!graphImageUrl}>
                            <div className={`${isExporting ? "opacity-0" : "opacity-100"}`}>Als PDF exportieren</div>
                            {isExporting && <LoadingSpinner className="absolute" />}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </>
    );
};

export default PdfExportConfiguration;
