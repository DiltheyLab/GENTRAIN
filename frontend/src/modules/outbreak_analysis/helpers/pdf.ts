import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import { CustomNode } from "@/modules/core/types/graph";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";

const addIntro = async (doc: jsPDF) => {
    const width = doc.internal.pageSize.getWidth();
    doc.text(
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        10,
        30,
        { maxWidth: width - 20 }
    );
};

const addHeadline = async (doc: jsPDF, name: string = "GenTrain - Ausbruchsanalysebericht") => {
    const width = doc.internal.pageSize.getWidth();
    const logoElement = document.querySelector(".gentrain-logo") as HTMLDivElement;
    const logoCanvas = await html2canvas(logoElement);
    if (logoCanvas) {
        const pdfLogoWidth = width / 6;
        const pdfLogoHeight = pdfLogoWidth * (logoElement.clientHeight / logoElement.clientWidth);
        doc.addImage(
            logoCanvas.toDataURL("#ffffff", {
                type: "image/jpeg",
                encoderOptions: 1.0,
            }),
            "JPEG",
            width - pdfLogoWidth - 10,
            10,
            pdfLogoWidth,
            pdfLogoHeight
        );
    }
    doc.setFont("Helvetica", "bold")
        .setFontSize(15)
        .text(`Analysebericht: ${name}`, 10, 15, { maxWidth: width - 20 })
        .setFont("Helvetica", "normal")
        .setFontSize(12);
};

const addGraphAsJpeg = async (doc: jsPDF) => {
    const width = doc.internal.pageSize.getWidth();
    //const graphCanvasElement = document.querySelector(".force-graph-container canvas") as HTMLCanvasElement;

    const graphElement = document.querySelector(".graph-visualization-panel") as HTMLFieldSetElement;
    const graphCanvasElement = await html2canvas(graphElement);

    if (graphCanvasElement) {
        const pdfGraphWidth = width;
        const pdfGraphHeight = pdfGraphWidth * (graphCanvasElement.height / graphCanvasElement.width);
        doc.addImage(
            graphCanvasElement.toDataURL("#ffffff", {
                type: "image/jpeg",
                encoderOptions: 1.0,
            }),
            "JPEG",
            10,
            60,
            pdfGraphWidth - 20,
            pdfGraphHeight - 20
        );
    }
};

const addInformationTable = async (doc: jsPDF) => {
    const nodes = useOutbreakAnalysisStore.getState().graphData.nodes;
    const tableHead = ["Fall Id", "Sequenz Id", "Lineage", "Ambiguous Characters", "Letztes Änderungsdatum"];
    const tableRows = nodes.map((node: CustomNode) => {
        return [
            node.caseData.case_id,
            node.caseData.sample ? node.caseData.sample.fasta_id : "",
            node.caseData.sample ? node.caseData.sample.lineage ?? "" : "",
            node.caseData.sample ? node.caseData.sample.n_count ?? "" : "",
            node.caseData.updated_at ? node.caseData.updated_at.toDateString() : "",
        ];
    });
    autoTable(doc, {
        head: [tableHead],
        body: tableRows,
        rowPageBreak: "avoid",
        headStyles: { fillColor: [249, 115, 22] },
        bodyStyles: {
            cellWidth: 36.5,
        },
    });
};

export const exportGraphAndInformationAsPdf = async (name: string | null) => {
    document.body.classList.add("capturing-pdf");
    const doc = new jsPDF({
        orientation: "p", // portrait
        unit: "mm",
        format: "a4",
    });
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    await addHeadline(doc, name ?? "GenTrain - Ausbruchsanalysebericht");
    await addIntro(doc);
    await addGraphAsJpeg(doc);
    doc.addPage();
    await addInformationTable(doc);
    doc.save("gentrain_graph_export.pdf");
    document.body.classList.remove("capturing-pdf");
};
