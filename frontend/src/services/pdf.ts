import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { db } from "@/database/db";
import { SampleSchema } from "@/database/samples";

const addHeadline = (doc: jsPDF, name: string) => {
    doc.text(name, 10, 15);
};

const addGraphAsJpeg = (doc: jsPDF) => {
    let width = doc.internal.pageSize.getWidth();
    let graphCanvasElement = document.querySelector(".force-graph-container canvas") as HTMLCanvasElement;
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
            10,
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
        "Lineage",
        "Ambiguous Characters",
        "Metadata",
        "Letztes Änderungsdatum",
    ];
    const tableRows = samples.map((sample: SampleSchema) => {
        return [
            sample.fasta_id,
            sample.ims_id ?? "",
            sample.lineage ?? "",
            sample.n_count ?? "",
            sample.metadata ?? "",
            sample.updated_at?.toLocaleDateString() ?? "",
        ];
    });
    autoTable(doc, {
        head: [tableHead],
        body: tableRows,
        rowPageBreak: "avoid",
        headStyles: { fillColor: [249, 115, 22] },
        bodyStyles: {
            cellWidth: 30,
        },
    });
};

export const exportGraphAndInformationAsPdf = async (name: string = "GenTrain - Ausbruchsanalysebericht") => {
    const doc = new jsPDF({
        orientation: "l", //landscape
        unit: "mm",
        format: "a4",
    });
    doc.setFontSize(20);
    addGraphAsJpeg(doc);
    addHeadline(doc, name);
    //doc.addPage();
    // await addInformationTable(doc);
    doc.save("gentrain_graph_export.pdf");
};
