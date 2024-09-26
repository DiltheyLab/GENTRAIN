import { getSelectedClusters, getUniqueTypesOfLinks } from "@/modules/core/helpers/graphs";
import { Text } from "@react-pdf/renderer";
import { View } from "lucide-react";
import { useMemo } from "react";
import { useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";
import { t } from "i18next";

const PdfGraphLegend = ({ preview = false }: { preview?: boolean }) => {
    const selectedClusters = getSelectedClusters();
    const outbreakAnalysisState = useOutbreakAnalysisStore.getState();
    const selectedOutbreakName = selectedClusters.selectedOutbreak[0];
    const selectedBackgroundNames = selectedClusters.selectedBackground;
    const colorMap = outbreakAnalysisState.graphSettings.colorMap;
    const links = useOutbreakAnalysisStore.getState().graphData.links;
    const uniqueTypesOfLinks = useMemo(() => getUniqueTypesOfLinks(links), [links]);
    const geneticDistanceLinks = uniqueTypesOfLinks.filter((link) => link.type === t(`linkTypes.geneticDistance`));
    const uniqueContactTracingLinks = uniqueTypesOfLinks.filter((link) => link.type !== t(`linkTypes.geneticDistance`));

    if (preview) {
        return (
            <div className="flex flex-col justify-center">
                <p className="text-[10px] font-bold mt-[5px]">Untersuchter Ausbruch</p>
                <div className="flex mt-[5px] items-center">
                    <div
                        style={{
                            marginRight: 5,
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            backgroundColor: colorMap[selectedOutbreakName].color,
                        }}
                    ></div>
                    <p className="text-[10px]">{selectedOutbreakName}</p>
                </div>
                {selectedBackgroundNames.length > 0 && <p className="text-[10px] font-bold mt-[5px]">Weitere Fälle</p>}
                {selectedBackgroundNames.map((name: string, key: number) => {
                    return (
                        <div key={key} className="flex items-center mt-[5px]">
                            <div
                                style={{
                                    marginRight: 5,
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    backgroundColor: colorMap[name].color,
                                }}
                            ></div>
                            <p
                                style={{
                                    color: "#000000",
                                    fontSize: 10,
                                    textAlign: "left",
                                }}
                            >
                                {name}
                            </p>
                        </div>
                    );
                })}
                {geneticDistanceLinks.length > 0 && <p className="text-[10px] font-bold mt-[5px]">Genetische Kanten</p>}
                {geneticDistanceLinks.map((link, key) => {
                    return (
                        <div key={key} className="flex mt-[5px] items-center">
                            <div
                                style={{
                                    backgroundColor: `${link.color}`,
                                    height: 1,
                                    width: 5,
                                    marginRight: 5,
                                }}
                            ></div>
                            <p className="text-[10px]">{link.type}</p>
                        </div>
                    );
                })}
                {uniqueContactTracingLinks.length > 0 && (
                    <p style={{ fontSize: 10, fontWeight: 600, marginTop: 5 }}>Kontaktkanten</p>
                )}
                {uniqueContactTracingLinks.map((link, key) => {
                    return (
                        <div key={key} className="flex mt-[5px] items-center">
                            <div
                                style={{
                                    backgroundColor: `${link.color}`,
                                    height: 1,
                                    width: 5,
                                    marginRight: 5,
                                }}
                            ></div>
                            <p style={{ fontSize: 10 }}>{link.type}</p>
                        </div>
                    );
                })}
            </div>
        );
    }
    return (
        <View
            style={{
                flexDirection: "column",
                justifyContent: "center",
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
                        backgroundColor: colorMap[selectedOutbreakName].color,
                    }}
                ></div>
                <Text
                    style={{
                        color: "#000000",
                        fontSize: 6,
                        textAlign: "left",
                    }}
                >
                    {selectedOutbreakName}
                </Text>
            </View>
            {selectedBackgroundNames.length > 0 && (
                <Text style={{ fontSize: 6, fontWeight: 600, marginTop: 5 }}>Weitere Fälle</Text>
            )}
            {selectedBackgroundNames.map((name: string, key: number) => {
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
                                textAlign: "left",
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
                        <Text style={{ fontSize: 6, textAlign: "left" }}>{link.type}</Text>
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

export default PdfGraphLegend;
