import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import { CustomNode } from "@/modules/core/types/graph";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";

const addIntro = async (doc: jsPDF) => {
    const width = doc.internal.pageSize.getWidth();
    const nodes = useOutbreakAnalysisStore.getState().graphData.nodes;
    const exampleNode = nodes[0];
    if (exampleNode.caseData.sample?.sequence_analysis?.nextclade_version) {
        doc.text(`Nextclade Version: ${exampleNode.caseData.sample.sequence_analysis.nextclade_version}`, 10, 35, {
            maxWidth: width - 20,
        });
    }
    if (exampleNode.caseData.sample?.sequence_analysis?.chewbbaca_version) {
        doc.text(`chewBACCA Version: ${exampleNode.caseData.sample.sequence_analysis.chewbbaca_version}`, 10, 35, {
            maxWidth: width - 20,
        });
    }
    if (exampleNode.caseData.sample?.sequence_analysis?.schema) {
        doc.text(`Schema: ${exampleNode.caseData.sample.sequence_analysis.schema}`, 10, 42, {
            maxWidth: width - 20,
        });
    }
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
    const pathogenTypeName = useCoreStore.getState().activePathogen?.pathogen_type?.name;
    const tableHead =
        pathogenTypeName === PathogenTypeName.viral
            ? ["Fall ID", "Sequenz ID", "Abstammung", "N's", "Sequenzlänge", "Registrierungsdatum"]
            : ["Fall ID", "Sequenz ID", "Registrierungsdatum"];
    const tableRows = nodes.map((node: CustomNode) => {
        return pathogenTypeName === PathogenTypeName.viral
            ? [
                  node.caseData.case_id,
                  node.caseData.sample?.fasta_id ?? "",
                  node.caseData.sample?.lineage ?? "",
                  node.caseData.sample?.n_count ?? "",
                  node.caseData.sample?.sequence_length ?? "",
                  node.caseData.registered_at.toDateString(),
              ]
            : [node.caseData.case_id, node.caseData.sample?.fasta_id ?? "", node.caseData.registered_at.toDateString()];
    });
    autoTable(doc, {
        head: [tableHead],
        body: tableRows,
        rowPageBreak: "avoid",
        headStyles: { fillColor: [249, 115, 22] },
        bodyStyles: {
            cellWidth: pathogenTypeName === PathogenTypeName.viral ? 30 : 50,
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
