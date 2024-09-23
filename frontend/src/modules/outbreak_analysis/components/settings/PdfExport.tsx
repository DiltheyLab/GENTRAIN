import { saveAs } from "file-saver";
import { Font, pdf, Text } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { Document, Page, View, StyleSheet, Image } from "@react-pdf/renderer";
import "@/assets/css/main.css";
import { useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";
import { ColorMap } from "@/modules/core/types/graph";
import { getSelectedClusters, getUniqueTypesOfLinks } from "@/modules/core/helpers/graphs";
import MerriweatherRegular from "@/assets/font/Merriweather_Sans/MerriweatherSans-Regular.ttf";
import MerriweatherItalic from "@/assets/font/Merriweather_Sans/MerriweatherSans-Italic.ttf";
import MerriweatherLight from "@/assets/font/Merriweather_Sans/MerriweatherSans-Light.ttf";
import MerriweatherLightItalic from "@/assets/font/Merriweather_Sans/MerriweatherSans-LightItalic.ttf";
import MerriweatherSemiBold from "@/assets/font/Merriweather_Sans/MerriweatherSans-SemiBold.ttf";
import MerriweatherBold from "@/assets/font/Merriweather_Sans/MerriweatherSans-Bold.ttf";
import { useEffect, useMemo, useState } from "react";
import { useCoreStore } from "@/modules/core/stores/core";
import { GraphPdf } from "@/modules/core/components/graph/GraphPdf";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { t } from "i18next";
import { Button } from "@/modules/core/components/ui/Button";
import { LoadingSpinner } from "@/modules/core/components/ui/LoadingSpinner";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { Textarea } from "@/modules/core/components/ui/Textarea";
import { Label } from "recharts";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";

Font.register({
    family: "Merriweather",
    fonts: [
        {
            src: MerriweatherRegular,
            fontWeight: 400,
        },
        {
            src: MerriweatherItalic,
            fontStyle: "italic",
            fontWeight: 400,
        },
        {
            src: MerriweatherLight,
            fontWeight: 300,
        },
        {
            src: MerriweatherLightItalic,
            fontStyle: "italic",
            fontWeight: 300,
        },
        {
            src: MerriweatherSemiBold,
            fontWeight: 600,
        },
        {
            src: MerriweatherBold,
            fontWeight: 700,
        },
    ],
});
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
    page: {
        fontFamily: "Merriweather",
        fontWeight: 300,
        fontSize: 10,
        lineHeight: 1.8,
        textAlign: "justify",
        flexDirection: "column",
        color: "#0F172A",
        backgroundColor: "#FFFFFF",
        padding: 50,
        position: "relative",
    },
    inline: {
        display: "flex",
        flexDirection: "row",
    },
    renderHtml: {
        fontSize: 10,
    },
});

const AnalysisReport = ({ conclusion, graphImage }: { conclusion: string | null; graphImage: string }) => {
    const coreState = useCoreStore.getState();
    const outbreakAnalysisState = useOutbreakAnalysisStore.getState();
    const selectedClusters = getSelectedClusters();
    const outbreakAnalysisName = outbreakAnalysisState.name;
    const selectedOutbreakName = selectedClusters.selectedOutbreak[0];
    const selectedBackgroundNames = selectedClusters.selectedBackground;
    const activePathogen = coreState.activePathogen;
    const nodes = outbreakAnalysisState.graphData.nodes;
    const links = outbreakAnalysisState.graphData.links;
    const uniqueTypesOfLinks = useMemo(() => getUniqueTypesOfLinks(links), [links]);
    const samples = nodes.filter((node) => node.caseData.sample);
    const samplesWithLowAmountOfNs = samples.filter(
        (node) => node.caseData.sample?.n_count && node.caseData.sample?.n_count < 1500
    );

    const geneticDistanceLinks = uniqueTypesOfLinks.filter((link) => link.type === t(`linkTypes.geneticDistance`));
    const uniqueContactTracingLinks = uniqueTypesOfLinks.filter((link) => link.type !== t(`linkTypes.geneticDistance`));
    const allContactTracingLinks = links.filter((link) => link.type !== t(`linkTypes.geneticDistance`));

    const caseCountWithoutOutbreak = nodes.filter((node) => !node.caseData.outbreak).length;
    const caseCountInSelectedOutbreak = nodes.filter(
        (node) => node.caseData.outbreak?.name === selectedOutbreakName
    ).length;
    const getTable = () => {
        return (
            <>
                <Headline level={2}>Analysierte Falldaten</Headline>
                <View style={{ fontSize: 8 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            textAlign: "center",
                            alignItems: "center",
                            fontWeight: 600,
                            borderBottom: "1px solid #0F172A",
                        }}
                    >
                        <Text style={{ width: "20%", padding: 5 }}>Fall-Nummer im MST</Text>
                        <Text style={{ width: "20%", padding: 5 }}>Sequenz-ID</Text>
                        <Text style={{ width: "20%", padding: 5 }}>Vermuteter Ausbruch</Text>
                        {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                            <>
                                <Text style={{ width: "20%", padding: 5 }}>Ns</Text>
                                <Text style={{ width: "20%", padding: 5 }}>IUPAC Ambiguity Characters</Text>
                                <Text style={{ width: "20%", padding: 5 }}>Abstammung</Text>
                            </>
                        )}
                        {activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial && (
                            <>
                                <Text style={{ width: "20%", padding: 5 }}>Contigs</Text>
                                <Text style={{ width: "20%", padding: 5 }}>Länge erster Contig</Text>
                                <Text style={{ width: "20%", padding: 5 }}>Unbestimmbare Gene</Text>
                            </>
                        )}
                    </View>
                    {nodes.map((node, key) => (
                        <View
                            key={key}
                            style={{
                                flexDirection: "row",
                                textAlign: "center",
                                alignItems: "center",
                                fontWeight: 300,
                            }}
                        >
                            <Text style={{ width: "20%", padding: 5 }}>{node.index}</Text>
                            <Text style={{ width: "20%", padding: 5 }}>{node.caseData.sample?.fasta_id ?? "-"}</Text>
                            <Text style={{ width: "20%", padding: 5 }}>{node.caseData.outbreak?.name ?? "-"}</Text>
                            {activePathogen?.pathogen_type?.name === PathogenTypeName.viral && (
                                <>
                                    <Text style={{ width: "20%", padding: 5 }}>
                                        {node.caseData.sample?.n_count ?? "-"}
                                    </Text>
                                    <Text style={{ width: "20%", padding: 5 }}>
                                        {node.caseData.sample?.ambiguity_character_count ?? "-"}
                                    </Text>
                                    <Text style={{ width: "20%", padding: 5 }}>
                                        {node.caseData.sample?.lineage ?? "-"}
                                    </Text>
                                </>
                            )}
                            {activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial && (
                                <>
                                    <Text style={{ width: "20%", padding: 5 }}>
                                        {node.caseData.sample?.contig_count ?? "-"}
                                    </Text>
                                    <Text style={{ width: "20%", padding: 5 }}>
                                        {node.caseData.sample?.first_contig_length ?? "-"}
                                    </Text>
                                    <Text style={{ width: "20%", padding: 5 }}>
                                        {node.caseData.sample?.undeterminable_gen_count ?? "-"}
                                    </Text>
                                </>
                            )}
                        </View>
                    ))}
                    <Text style={{ fontSize: 8, fontStyle: "italic", paddingTop: 10, borderTop: "1px solid #0F172A" }}>
                        Tabelle 1: Falldaten nach Fall-Nummer aus Abbildung 1 inklusive relevanter Parameter zur
                        Beurteilung der Qualität der{" "}
                        {activePathogen?.pathogen_type?.name === PathogenTypeName.viral ? "viralen" : "bakteriellen"}{" "}
                        Sequenzen.
                    </Text>
                </View>
            </>
        );
    };

    const getLegend = (colorMap: ColorMap, outbreakName: string, backgroundNames: string[]) => {
        return (
            <View
                style={{
                    marginLeft: 5,
                    flexDirection: "column",
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
            >
                <Text style={{ fontSize: 6, fontWeight: 600, marginTop: 5 }}>Untersuchter Ausbruch</Text>
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <div
                        style={{
                            marginTop: 1,
                            marginRight: 5,
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: colorMap[outbreakName].color,
                        }}
                    ></div>
                    <Text
                        style={{
                            color: "#000000",
                            fontSize: 6,
                        }}
                    >
                        {outbreakName}
                    </Text>
                </View>
                {backgroundNames.length > 0 && (
                    <Text style={{ fontSize: 6, fontWeight: 600, marginTop: 5 }}>Weitere Fälle</Text>
                )}
                {backgroundNames.map((name: string, key: number) => {
                    return (
                        <View key={key} style={{ flexDirection: "row", marginTop: 5 }}>
                            <div
                                style={{
                                    marginTop: 1,
                                    marginRight: 5,
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    backgroundColor: colorMap[name].color,
                                }}
                            ></div>
                            <Text
                                style={{
                                    color: "#000000",
                                    fontSize: 6,
                                }}
                            >
                                {name}
                            </Text>
                        </View>
                    );
                })}
                {geneticDistanceLinks.length > 0 && (
                    <Text style={{ fontSize: 6, fontWeight: 600, marginTop: 5 }}>Genetische Kanten</Text>
                )}
                {geneticDistanceLinks.map((link, key) => {
                    return (
                        <View key={key} style={{ flexDirection: "row", marginTop: 5 }}>
                            <div
                                style={{
                                    backgroundColor: `${link.color}`,
                                    height: 1,
                                    width: 5,
                                    marginTop: 3,
                                    marginRight: 5,
                                }}
                            ></div>
                            <Text style={{ fontSize: 6 }}>{link.type}</Text>
                        </View>
                    );
                })}
                {uniqueContactTracingLinks.length > 0 && (
                    <Text style={{ fontSize: 6, fontWeight: 600, marginTop: 5 }}>Kontaktkanten</Text>
                )}
                {uniqueContactTracingLinks.map((link, key) => {
                    return (
                        <View key={key} style={{ flexDirection: "row", marginTop: 5 }}>
                            <div
                                style={{
                                    backgroundColor: `${link.color}`,
                                    height: 1,
                                    width: 5,
                                    marginTop: 3,
                                    marginRight: 5,
                                }}
                            ></div>
                            <Text style={{ fontSize: 6 }}>{link.type}</Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    const getSummary = () => {
        return (
            <View>
                <Paragraph>
                    Der analysierte Datensatz umfasst Falldaten des{" "}
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.viral ? "viralen" : "bakteriellen"}{" "}
                    Pathogens "{activePathogen?.name}".
                    <br />
                    <br /> Es existieren {caseCountInSelectedOutbreak}{" "}
                    {caseCountInSelectedOutbreak > 1 ? "Fälle" : "Fall"} des zu untersuchenden vermuteten Ausbruchs "
                    {selectedOutbreakName}"
                    {selectedBackgroundNames.map((clusterName: string, index: number) => {
                        const caseCountInCluster = nodes.filter(
                            (node) => node.caseData.outbreak?.name === clusterName
                        ).length;
                        if (caseCountInCluster === 0) {
                            return;
                        }
                        return (
                            <Text key={index}>
                                {index === selectedBackgroundNames.length - 1 && caseCountWithoutOutbreak === 0
                                    ? " sowie "
                                    : ", "}
                                {caseCountInCluster} {caseCountInCluster > 1 ? "Fälle" : "Fall"} des vermuteten
                                Ausbruchs <Text style={{ fontStyle: "italic" }}>"{clusterName}"</Text>
                            </Text>
                        );
                    })}
                    {caseCountWithoutOutbreak > 0 ? (
                        <Text>
                            {" "}
                            sowie {caseCountWithoutOutbreak} {caseCountWithoutOutbreak > 1 ? "Fälle" : "Fall"} aus der
                            Umgebung ohne Ausbruchszuweisung.
                        </Text>
                    ) : (
                        <Text>.</Text>
                    )}
                    {"\n\n"}
                    Für {samples.length} von {nodes.length} Fällen liegen genetische Sequenzdaten vor
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.viral &&
                        `, wobei ${samplesWithLowAmountOfNs.length} von ${samples.length} Genomen fast perfekt (< 1500 Ns) aufgelöst sind`}
                    .{" "}
                    {allContactTracingLinks.length > 0 && (
                        <Text>
                            Es sind {allContactTracingLinks.length} Kontaktangaben aus der Kontaktnachverfolgung
                            enthalten.
                        </Text>
                    )}
                </Paragraph>
            </View>
        );
    };

    const Paragraph = ({ styles, children }: { styles?: object; children: any }) => {
        const defaults = { marginBottom: 5 };
        let mergedStyles = { ...defaults, ...styles };

        return <Text style={mergedStyles}>{children}</Text>;
    };

    const Headline = ({ level, children }: { level: number; children: any }) => {
        switch (level) {
            case 1:
                return <Text style={{ fontSize: 16, fontWeight: 400, marginBottom: 10 }}>{children}</Text>;
            case 2:
                return <Text style={{ fontSize: 14, fontWeight: 300, marginVertical: 10 }}>{children}</Text>;
            default:
                return <Text style={{ fontSize: 12, fontWeight: 400, marginVertical: 10 }}>{children}</Text>;
        }
    };

    const colorMap = outbreakAnalysisState.graphSettings.colorMap;

    if (!selectedOutbreakName) return;
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ height: "100%" }}>
                    <Headline level={1}>Ausbruchsanalyse-Report "{outbreakAnalysisName}"</Headline>
                    <Headline level={2}>
                        Zusammenfassung des analysierten Datensatzes und Ergebnisse der Qualitätskontrolle
                    </Headline>
                    {getSummary()}
                    <Headline level={2}>Grafische Darstellung der Struktur der analysierten Fälle</Headline>
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            marginTop: 10,
                        }}
                    >
                        <Image source={graphImage} style={{ marginBottom: 15, paddingRight: 5 }} />
                        {getLegend(colorMap, selectedOutbreakName, selectedBackgroundNames)}
                    </View>
                    <Text style={{ fontSize: 8, fontStyle: "italic", marginTop: 10 }}>
                        Abbildung 1: Minimum Spanning Tree (MST) der analysierten Fälle. Jeder Knoten im MST
                        repräsentiert einen gemeldeten Fall; Knoten-Farben zeigen den Falltyp an (Umgebungsproben oder
                        als potentieller Ausbruch gekennzeichnete Proben). Genetische Abstände zwischen den
                        sequenzierten{" "}
                        {activePathogen?.pathogen_type?.name === PathogenTypeName.viral ? "viralen" : "bakteriellen"}{" "}
                        Genomen werden über graue Kanten zwischen Punkten visualisiert, die mit dem jeweiligen
                        genetischen Abstand beschriftet sind.
                        {allContactTracingLinks.length > 0 &&
                            " Kontakte zwischen Fällen sind durch farbliche Kanten repräsentiert."}{" "}
                        Zahlen in den Knoten beziehen sich auf die Spalte "Fall-Nummer im MST" in Tabelle 1.
                    </Text>
                </View>
                <Headline level={2}>Bewertung</Headline>
                {conclusion && <Text style={{ marginBottom: 10 }}>{conclusion}</Text>}
                <View style={{ marginBottom: 5 }}>{getTable()}</View>
                <Text
                    style={{ position: "absolute", bottom: 30, right: 30, fontSize: 8 }}
                    render={({ pageNumber }) => `${pageNumber}`}
                    fixed
                />
            </Page>
        </Document>
    );
};

const PdfExport = ({ onPdfExport }: { onPdfExport: () => void }) => {
    const outbreakAnalysisState = useOutbreakAnalysisStore.getState();
    const coreState = useCoreStore.getState();
    const { charge, showNodeLabel, colorMap, coloringMode } = outbreakAnalysisState.graphSettings;
    const cases = coreState.casesWithRelationships;
    const [isExporting, setIsExporting] = useState(false);
    const [graphReadyForExport, setGraphReadyForExport] = useState(false);
    const [conclusion, setConclusion] = useState<string | null>(null);
    const [generateSummary, setGenerateSummary] = useState(true);
    const [generateConclusion, setGenerateConclusion] = useState(false);
    useEffect(() => {
        if (graphReadyForExport) {
            exportPdf();
        }
    }, [graphReadyForExport]);

    const exportPdf = async () => {
        const graphElement = document.querySelector(".pdf-graph") as HTMLDivElement;
        const graphCanvasElement = await html2canvas(graphElement);
        const graphImageDataURL = graphCanvasElement.toDataURL("#ffffff", {
            type: "image/jpeg",
            encoderOptions: 1.0,
        });
        const fileName = "test.pdf";
        const blob = await pdf(<AnalysisReport conclusion={conclusion} graphImage={graphImageDataURL} />).toBlob();
        saveAs(blob, fileName);
        setIsExporting(false);
        setGraphReadyForExport(false);
        onPdfExport();
    };

    const downloadPdf = async () => {
        setIsExporting(true);
    };

    return (
        <>
            <DialogContent className="max-w-[1000px] w-screen">
                <div>
                    <DialogHeader>
                        <DialogTitle className="mb-5">
                            Ausbruchsanalyse-Report zu "{outbreakAnalysisState.name}"
                        </DialogTitle>
                    </DialogHeader>
                    {isExporting && (
                        <div className="z-[-1] overflow-hidden relative">
                            <div className="absolute top-0 left-0 pdf-graph">
                                <GraphPdf
                                    data={outbreakAnalysisState.graphData}
                                    width={1200}
                                    height={900}
                                    colorMap={colorMap}
                                    coloringMode={coloringMode}
                                    cases={cases}
                                    charge={charge}
                                    linkDistance={50}
                                    nodeSize={10}
                                    showNodeLabel={showNodeLabel}
                                    linkWidth={2}
                                    updateSelectedCase={() => {}}
                                    selectedCase={null}
                                    exportPdfOnEngineStop={() => setGraphReadyForExport(true)}
                                />
                            </div>
                            <div className="absolute w-full h-full top-0 left-0 bg-white"></div>
                        </div>
                    )}
                    <div className="mb-5">
                        <div className="mb-2">
                            <p className="font-bold">Zusammenfassung des Datensatzes</p>
                            <small>
                                Verfassen Sie eine Zusammenfassung des Datensatzes für die Ausbruchsanalyse oder lassen
                                Sie sich eine Zusammenfassung generieren.
                            </small>
                        </div>
                        <div className="flex items-center mb-2">
                            <Checkbox
                                className="mr-2"
                                id="generateSummaryCheckbox"
                                checked={generateSummary}
                                onCheckedChange={() => setGenerateSummary(!generateSummary)}
                            />
                            <label htmlFor="generateSummaryCheckbox">
                                Zusammenfassung automatisch generieren lassen
                            </label>
                        </div>
                        <Textarea
                            disabled={generateSummary}
                            className="min-h-[200px]"
                            onChange={(evt) => setConclusion(evt.target.value)}
                        />
                    </div>
                    <div className="mb-5">
                        <div className="mb-2">
                            <p className="font-bold">Bewertung</p>
                            <small>
                                Verfassen Sie eine Bewertung für die Ausbruchsanalyse oder lassen Sie sich eine
                                Bewertung generieren.
                            </small>
                        </div>
                        {/*<div className="flex items-center mb-2">
                            <Checkbox
                                className="mr-2"
                                id="generateConclusionCheckbox"
                                checked={generateConclusion}
                                onCheckedChange={() => setGenerateConclusion(!generateConclusion)}
                            />
                            <label htmlFor="generateConclusionCheckbox">Bewertung automatisch generieren lassen</label>
                        </div>*/}
                        <Textarea
                            disabled={generateConclusion}
                            className="min-h-[200px]"
                            onChange={(evt) => setConclusion(evt.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <div className="flex justify-end">
                            <Button onClick={() => downloadPdf()}>
                                <div className={`${isExporting ? "opacity-0" : "opacity-100"}`}>Exportieren</div>
                                {isExporting && <LoadingSpinner className="absolute" />}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </>
    );
};

export default PdfExport;
