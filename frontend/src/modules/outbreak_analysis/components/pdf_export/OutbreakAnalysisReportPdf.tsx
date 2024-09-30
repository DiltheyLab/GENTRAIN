import { Document, Page, View, StyleSheet, Image, Font, Text } from "@react-pdf/renderer";
import { useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";
import { getSelectedClusters } from "@/modules/core/helpers/graphs";
import MerriweatherRegular from "@/assets/font/Merriweather_Sans/MerriweatherSans-Regular.ttf";
import MerriweatherItalic from "@/assets/font/Merriweather_Sans/MerriweatherSans-Italic.ttf";
import MerriweatherLight from "@/assets/font/Merriweather_Sans/MerriweatherSans-Light.ttf";
import MerriweatherLightItalic from "@/assets/font/Merriweather_Sans/MerriweatherSans-LightItalic.ttf";
import MerriweatherSemiBold from "@/assets/font/Merriweather_Sans/MerriweatherSans-SemiBold.ttf";
import MerriweatherBold from "@/assets/font/Merriweather_Sans/MerriweatherSans-Bold.ttf";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { PdfDataGenerator } from "../../services/pdf_export/PdfDataGenerator";
import PdfGraphLegend from "./PdfGraphLegend";
import { Headline } from "./PdfHeadline";

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

const OutbreakAnalysisReportPdf = ({
    pdfDataGenerator,
    graphImageUrl,
}: {
    pdfDataGenerator: PdfDataGenerator;
    graphImageUrl: string;
}) => {
    const coreState = useCoreStore.getState();
    const outbreakAnalysisState = useOutbreakAnalysisStore.getState();
    const selectedClusters = getSelectedClusters();
    const outbreakAnalysisName = outbreakAnalysisState.name;
    const selectedOutbreakName = selectedClusters.selectedOutbreak[0];
    const activePathogen = coreState.activePathogen;

    if (!selectedOutbreakName) return;

    const getCaseDataTable = () => {
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
                        {pdfDataGenerator.getCaseDataTableColumns().map((column, key) => (
                            <Text key={key} style={{ width: "20%", padding: 5 }}>
                                {column}
                            </Text>
                        ))}
                    </View>
                    {pdfDataGenerator.getCaseDataTableRows().map((row, key) => (
                        <View
                            key={key}
                            style={{
                                flexDirection: "row",
                                textAlign: "center",
                                alignItems: "center",
                            }}
                        >
                            {row.map((cell, key) => (
                                <Text key={key} style={{ width: "20%", padding: 5 }}>
                                    {cell}
                                </Text>
                            ))}
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

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ height: "100%" }}>
                    <Headline level={1}>Ausbruchsanalyse-Report "{outbreakAnalysisName}"</Headline>
                    <Headline level={2}>
                        Zusammenfassung des analysierten Datensatzes und Ergebnisse der Qualitätskontrolle
                    </Headline>
                    <View style={{ marginBottom: 5 }}>
                        <Text>{outbreakAnalysisState.analysisReport.summary}</Text>
                    </View>

                    <Headline level={2}>Grafische Darstellung der Struktur der analysierten Fälle</Headline>
                    <View
                        style={{
                            width: "100%",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <View style={{ width: "83%" }}>
                            <Image source={graphImageUrl} style={{ marginBottom: 15, paddingRight: 5 }} />
                        </View>
                        <View style={{ width: "15%" }}>
                            <PdfGraphLegend />
                        </View>
                    </View>
                    <Text style={{ fontSize: 8, fontStyle: "italic", marginTop: 10 }}>
                        {pdfDataGenerator.getGraphImageDescription()}
                    </Text>
                </View>
                <Headline level={2}>Bewertung</Headline>

                <View style={{ marginBottom: 5 }}>
                    <Text>{outbreakAnalysisState.analysisReport.conclusion}</Text>
                </View>

                <View style={{ marginBottom: 5 }}>{getCaseDataTable()}</View>
                <Text
                    style={{ position: "absolute", bottom: 30, right: 30, fontSize: 8 }}
                    render={({ pageNumber }) => `${pageNumber}`}
                    fixed
                />
            </Page>
        </Document>
    );
};

export default OutbreakAnalysisReportPdf;
