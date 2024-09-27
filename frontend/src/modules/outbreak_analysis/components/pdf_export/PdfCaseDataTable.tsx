import { View, Text } from "@react-pdf/renderer";
import { getSelectedClusters } from "@/modules/core/helpers/graphs";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { Headline } from "./PdfHeadline";

const PdfCaseDataTable = ({ columns, rows }: { columns: string[]; rows: string[][] }) => {
    const coreState = useCoreStore.getState();
    const selectedClusters = getSelectedClusters();
    const selectedOutbreakName = selectedClusters.selectedOutbreak[0];
    const activePathogen = coreState.activePathogen;

    if (!selectedOutbreakName) return;

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
                    {columns.map((column, key) => (
                        <Text key={key} style={{ width: "20%", padding: 5 }}>
                            {column}
                        </Text>
                    ))}
                </View>
                {rows.map((row, key) => (
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
                    Tabelle 1: Falldaten nach Fall-Nummer aus Abbildung 1 inklusive relevanter Parameter zur Beurteilung
                    der Qualität der{" "}
                    {activePathogen?.pathogen_type?.name === PathogenTypeName.viral ? "viralen" : "bakteriellen"}{" "}
                    Sequenzen.
                </Text>
            </View>
        </>
    );
};

export default PdfCaseDataTable;
