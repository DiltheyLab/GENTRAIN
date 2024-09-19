import { Button } from "@/modules/core/components/ui/Button";
import { saveAs } from "file-saver";
import { Font, pdf, Text } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { Document, Page, View, StyleSheet, Image } from "@react-pdf/renderer";
import "@/assets/css/pdf.css";
import { useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";
import { ColorMap } from "@/modules/core/types/graph";
import { getSelectedClusters } from "@/modules/core/helpers/graphs";
import MerriweatherRegular from "@/assets/font/Merriweather_Sans/MerriweatherSans-Regular.ttf";
import MerriweatherLight from "@/assets/font/Merriweather_Sans/MerriweatherSans-Light.ttf";
import MerriweatherSemiBold from "@/assets/font/Merriweather_Sans/MerriweatherSans-SemiBold.ttf";
import MerriweatherBold from "@/assets/font/Merriweather_Sans/MerriweatherSans-Bold.ttf";
import { Graph2D } from "@/modules/core/components/graph/Graph2D";
import { useEffect, useRef, useState } from "react";
import { useResizeContainer } from "@/modules/core/hooks/useResizeContainer";
import { useCoreStore } from "@/modules/core/stores/core";
import { GraphPdf } from "@/modules/core/components/graph/GraphPdf";

Font.register({
    family: "Merriweather",
    fonts: [
        {
            src: MerriweatherRegular,
            fontWeight: 400,
        },
        {
            src: MerriweatherLight,
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
});

const getLegend = (colorMap: ColorMap, outbreakName: string, backgroundNames: string[]) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap",
            }}
        >
            <View style={{ flexDirection: "row", margin: 5 }}>
                <div
                    style={{
                        marginRight: 5,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: colorMap[outbreakName].color,
                    }}
                ></div>
                <Text
                    style={{
                        color: "#000000",
                        fontSize: 10,
                    }}
                >
                    {outbreakName}
                </Text>
            </View>
            {backgroundNames.map((name: string, key: number) => (
                <View key={key} style={{ flexDirection: "row", margin: 5 }}>
                    <div
                        style={{
                            marginRight: 5,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: colorMap[name].color,
                        }}
                    ></div>
                    <Text
                        style={{
                            color: "#000000",
                            fontSize: 10,
                        }}
                    >
                        {name}
                    </Text>
                </View>
            ))}
        </View>
    );
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

const Paragraph = ({ styles, children }: { styles?: object; children: any }) => {
    const defaults = { marginBottom: 5 };
    let mergedStyles = { ...defaults, ...styles };

    return <Text style={mergedStyles}>{children}</Text>;
};

const AnalysisReport = ({ graphImage }: { graphImage: string }) => {
    const outbreakAnalysisState = useOutbreakAnalysisStore.getState();
    const selectedClusters = getSelectedClusters();
    const outbreakAnalysisName = outbreakAnalysisState.name;
    const selectedOutbreakName = selectedClusters.selectedOutbreak[0];
    const selectedBackgroundNames = selectedClusters.selectedBackground;

    const colorMap = outbreakAnalysisState.graphSettings.colorMap;

    if (!selectedOutbreakName) return;
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Headline level={1}>Ausbruchsanalyse-Report "{outbreakAnalysisName}"</Headline>
                <Headline level={2}>
                    Zusammenfassung des analysierten Datensatzes und Ergebnisse der Qualitätskontrolle
                </Headline>
                <Paragraph>
                    Der analysierte Datensatz umfasst 9 SARS-CoV-2-Isolate aus Gütersloh, 1 SARS-CoV-2-Isolat aus Halle,
                    2 SARS-CoV-2-Isolate aus Marienfeld, 1 SARS-CoV-2-Isolat aus Rietberg, 1 SARS-CoV-2- Isolat aus
                    Steinhagen sowie 1 SARS-CoV-2-Isolat aus Versmold als potentielle Ausbruchsproben; 1
                    SARS-CoV-2-Isolat aus Borgholzhausen, 12 SARS-CoV-2-Isolate aus Gütersloh, 1 SARS-CoV-2- Isolat aus
                    Halle, 2 SARS-CoV-2-Isolate aus Halle (Westf.), 2 SARS-CoV-2-Isolate aus Harsewinkel, 1
                    SARS-CoV-2-Isolat aus Herzebrock-Clarholz, 1 SARS-CoV-2-Isolat aus Leopoldshöhe, 1 SARS-
                    CoV-2-Isolat aus Rheda-Wiedenbrueck, 3 SARS-CoV-2-Isolate aus Rheda-Wiedenbrück, 3 SARS-
                    CoV-2-Isolate aus Rietberg, 2 SARS-CoV-2-Isolate aus Schloß Holte-Stukenbrock, 2 SARS-CoV-2- Isolate
                    aus Verl, 1 SARS-CoV-2-Isolat aus Versmold, 1 SARS-CoV-2-Isolat mit unbekanntem Herkunftsort als
                    Umgebungsproben; sowie das Wuhan-SARS-CoV-2-Referenzgenom (Genbank-ID: MN908947.3).
                </Paragraph>
                <Headline level={2}>Grafische Darstellung der genetischen Struktur der analysierten Proben</Headline>
                <View
                    style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image source={graphImage} style={{ marginBottom: 15 }} />
                    {getLegend(colorMap, selectedOutbreakName, selectedBackgroundNames)}
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
                            linkWidth={1}
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
