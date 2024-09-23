import { Button } from "@/modules/core/components/ui/Button";
import { saveAs } from "file-saver";
import { Font, pdf, Text } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { Document, Page, View, StyleSheet, Image } from "@react-pdf/renderer";
import "@/assets/css/pdf.css";
import { useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";
import { ColorMap } from "@/modules/core/types/graph";
import { getSelectedClusters, getUniqueTypesOfLinks } from "@/modules/core/helpers/graphs";
import MerriweatherRegular from "@/assets/font/Merriweather_Sans/MerriweatherSans-Regular.ttf";
import MerriweatherItalic from "@/assets/font/Merriweather_Sans/MerriweatherSans-Italic.ttf";
import MerriweatherLight from "@/assets/font/Merriweather_Sans/MerriweatherSans-Light.ttf";
import MerriweatherLightItalic from "@/assets/font/Merriweather_Sans/MerriweatherSans-LightItalic.ttf";
import MerriweatherSemiBold from "@/assets/font/Merriweather_Sans/MerriweatherSans-SemiBold.ttf";
import MerriweatherBold from "@/assets/font/Merriweather_Sans/MerriweatherSans-Bold.ttf";
<<<<<<< HEAD
import { Graph2D } from "@/modules/core/components/graph/Graph2D";
import { useEffect, useRef, useState } from "react";
import { useResizeContainer } from "@/modules/core/hooks/useResizeContainer";
=======
import { useEffect, useMemo, useState } from "react";
>>>>>>> 6388381 (chore: adjust legent and introduction)
import { useCoreStore } from "@/modules/core/stores/core";
import { GraphPdf } from "@/modules/core/components/graph/GraphPdf";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { t } from "i18next";

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

const styles = StyleSheet.create({
    page: {
        fontFamily: "Merriweather",
        fontWeight: 300,
        fontSize: 10,
        lineHeight: 1.7,
        textAlign: "justify",
        flexDirection: "column",
        color: "#0F172A",
        backgroundColor: "#FFFFFF",
        padding: 50,
    },
    inline: {
        display: "flex",
        flexDirection: "row",
    },
});

const AnalysisReport = ({ graphImage }: { graphImage: string }) => {
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
                </Paragraph>
                <Paragraph>
                    Es existieren {caseCountInSelectedOutbreak} {caseCountInSelectedOutbreak > 1 ? "Fälle" : "Fall"} des
                    zu untersuchenden vermuteten Ausbruchs "{selectedOutbreakName}"
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
                </Paragraph>
                <Paragraph>
                    Für {nodes.length - caseCountWithoutOutbreak} von {nodes.length} Fällen liegen genetische
                    Sequenzdaten vor.
                    {allContactTracingLinks.length > 0 &&
                        ` Es sind außerdem ${allContactTracingLinks.length} Kontaktangaben enthalten.`}
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
                return <Text style={{ fontSize: 16, fontWeight: 400, marginBottom: 5 }}>{children}</Text>;
            case 2:
                return <Text style={{ fontSize: 14, fontWeight: 300, marginVertical: 5 }}>{children}</Text>;
            default:
                return <Text style={{ fontSize: 12, fontWeight: 400, marginBottom: 5 }}>{children}</Text>;
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
                        <Image source={graphImage} style={{ marginBottom: 15 }} />
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
            </Page>
        </Document>
    );
};

const PdfExportButton = () => {
    const outbreakAnalysisState = useOutbreakAnalysisStore.getState();
    const coreState = useCoreStore.getState();
    const { charge, showNodeLabel, colorMap, coloringMode } = outbreakAnalysisState.graphSettings;
    const cases = coreState.casesWithRelationships;
    const [renderPdfGraph, setRenderPdfGraph] = useState(false);
    const [graphReadyForExport, setGraphReadyForExport] = useState(false);

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
        console.log(graphImageDataURL);
        const fileName = "test.pdf";
        const blob = await pdf(<AnalysisReport graphImage={graphImageDataURL} />).toBlob();
        saveAs(blob, fileName);
        setRenderPdfGraph(false);
        setGraphReadyForExport(false);
    };

    const downloadPdf = async () => {
        setRenderPdfGraph(true);
    };
    return (
        <>
            <Button className="mt-2" variant="outline" type="button" onClick={() => downloadPdf()}>
                Analysebericht exportieren
            </Button>
            {renderPdfGraph && (
                <div className="z-[-1]">
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
        </>
    );
};

export default PdfExportButton;
