import { Button } from "@/modules/core/components/ui/Button";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { Document, Page, View, StyleSheet, Image } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

// Create Document Component
const AnalysisReport = ({ graphDataUrl }: { graphDataUrl: string }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Image src={graphDataUrl} />
            </View>
        </Page>
    </Document>
);

const PdfExportButton = () => {
    const downloadPdf = async () => {
        const graphElement = document.querySelector(".graph-visualization-panel") as HTMLFieldSetElement;
        const graphCanvasElement = await html2canvas(graphElement);
        const graphImageDataURL = graphCanvasElement.toDataURL("#ffffff", {
            type: "image/jpeg",
            encoderOptions: 1.0,
        });
        const fileName = "test.pdf";
        const blob = await pdf(<AnalysisReport graphDataUrl={graphImageDataURL} />).toBlob();
        saveAs(blob, fileName);
    };
    return (
        <Button className="mt-2" variant="outline" type="button" onClick={() => downloadPdf()}>
            Analysebericht exportieren
        </Button>
    );
};

export default PdfExportButton;
