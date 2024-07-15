import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { db } from "@/database/db";
import { SampleSchema } from "@/database/samples";

const addHeadline = (doc: jsPDF) => {
    doc.text("GENTRAIN Export", 10, 15);
};

const addGraphAsJpeg = (doc: jsPDF) => {
    var width = doc.internal.pageSize.getWidth();
    var graphCanvasElement = document.querySelector(
        "#graph-container .force-graph-container canvas"
    ) as HTMLCanvasElement;
    if (graphCanvasElement) {
        const pdfGraphWidth = width;
        const pdfGraphHeight = pdfGraphWidth * (graphCanvasElement.height / graphCanvasElement.width);
        doc.addImage(
            graphCanvasElement.toDataURL("#ffffff", {
                type: "image/jpeg",
                encoderOptions: 1.0,
            }),
            "JPEG",
            0,
            30,
            pdfGraphWidth,
            pdfGraphHeight
        );
    }
};

const addInformationTable = async (doc: jsPDF) => {
    const samples = await db.samples.toArray();
    const tableHead = [
        "Fasta Id",
        "IMS Id (RKI)",
        "Group",
        "Lineage",
        "Ambiguous Characters",
        "Sending Lab",
        "Sequencing Lab",
        "Metadata",
        "Sample Datum",
        "Letztes Änderungsdatum",
    ];
    const tableRows = samples.map((sample: SampleSchema) => {
        return [
            sample.fasta_id,
            sample.ims_id,
            sample.group,
            sample.lineage,
            sample.n_count,
            sample.location_sending_lab,
            sample.location_sequencing_lab,
            sample.metadata,
            sample.sampled_at.toLocaleDateString(),
            sample.updated_at.toLocaleDateString(),
        ];
    });
    autoTable(doc, {
        head: [tableHead],
        body: tableRows,
        rowPageBreak: "avoid",
        headStyles: { fillColor: [249, 115, 22] },
        bodyStyles: {
            cellWidth: 27,
        },
    });
};

export const exportGraphAndInformationAsPdf = async () => {
    const doc = new jsPDF({
        orientation: "l", //landscape
        unit: "mm",
        format: "a4",
    });
    doc.setFontSize(20);
    addGraphAsJpeg(doc);
    addHeadline(doc);
    doc.addPage();
    await addInformationTable(doc);
    doc.save("gentrain_graph_export.pdf");
};
