import { categorizeLinks, getSelectedClusters } from "@/modules/core/helpers/graphs";
import { Text } from "@react-pdf/renderer";
import { View } from "lucide-react";
import { useMemo } from "react";
import { useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";
import { useCoreStore } from "@/modules/core/stores/core";

const PdfGraphLegend = ({ preview = false }: { preview?: boolean }) => {
    const selectedClusters = getSelectedClusters();
    const outbreakAnalysisState = useOutbreakAnalysisStore.getState();
    const selectedOutbreakName = selectedClusters.selectedOutbreak[0];
    const selectedBackgroundNames = selectedClusters.selectedBackground;
    const colorMap = outbreakAnalysisState.graphSettings.colorMap;
    const links = useOutbreakAnalysisStore.getState().graphData.links;
    const geneticDistanceThreshold = useCoreStore.getState().activePathogen?.genetic_distance_threshold;
    const { geneticDistanceLinksBelowThreshold, geneticDistanceLinksAboveThreshold, contactTracingLinks } = useMemo(
        () => categorizeLinks(links, geneticDistanceThreshold),
        [links]
    );

    const SectionHeadline = ({ children }: { children: string }) => {
        return (
            <>
                {preview ? (
                    <p className="font-bold mt-[5px]">{children}</p>
                ) : (
                    <Text style={{ fontSize: 6, fontWeight: 600, marginTop: 5 }}>{children}</Text>
                )}
            </>
        );
    };

    const Entry = ({
        type,
        color,
        children,
    }: {
        type: "node" | "link" | "link-dashed";
        color: string;
        children: string;
    }) => {
        return (
            <>
                {preview ? (
                    <div className="flex mt-[5px] items-center">
                        <div
                            className={`${
                                type === "node"
                                    ? "rounded-full w-[5px] h-[5px] ml-[2px] mr-[7px]"
                                    : type === "link"
                                      ? "w-[9px] h-[2px] mr-[5px]"
                                      : "w-[9px] h-[2px] border-b-[2px] border-dashed mr-[5px]"
                            }`}
                            style={{
                                backgroundColor: type === "link-dashed" ? "" : color,
                                borderColor: type === "link-dashed" ? color : "",
                            }}
                        />
                        <p>{children}</p>
                    </div>
                ) : (
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <div
                            style={{
                                marginTop: type === "node" ? 1 : 3,
                                marginLeft: type === "node" ? 2 : 0,
                                marginRight: type === "node" ? 7 : 5,
                                width: type === "node" ? 5 : 9,
                                height: type === "node" ? 5 : 1,
                                borderRadius: type === "node" ? "50%" : 0,
                                backgroundColor: type === "link-dashed" ? "" : color,
                                borderColor: type === "link-dashed" ? color : "",
                                borderStyle: type === "link-dashed" ? "dashed" : "solid",
                                borderBottomWidth: type === "link-dashed" ? 1 : 0,
                            }}
                        ></div>
                        <Text
                            style={{
                                color: "#000000",
                                fontSize: 6,
                                textAlign: "left",
                            }}
                        >
                            {children}
                        </Text>
                    </View>
                )}
            </>
        );
    };

    const getLabels = () => {
        return (
            <>
                <SectionHeadline>Untersuchter Ausbruch</SectionHeadline>
                <Entry type="node" color={colorMap[selectedOutbreakName].color}>
                    {selectedOutbreakName}
                </Entry>
                {selectedBackgroundNames.length > 0 && <SectionHeadline>Weitere Fälle</SectionHeadline>}
                {selectedBackgroundNames.map((name) => (
                    <Entry key={name} type="node" color={colorMap[name].color}>
                        {name}
                    </Entry>
                ))}
                <SectionHeadline>Genetische Kanten</SectionHeadline>
                {geneticDistanceLinksBelowThreshold.map((link, index) => (
                    <Entry key={index} type="link" color={link.color}>
                        {link.type}
                    </Entry>
                ))}
                {geneticDistanceLinksAboveThreshold.map((link, index) => (
                    <Entry key={index} type="link-dashed" color={link.color}>
                        {link.type}
                    </Entry>
                ))}
                {contactTracingLinks.length > 0 && <SectionHeadline>Kontaktkanten</SectionHeadline>}
                {contactTracingLinks.map((link, index) => (
                    <Entry key={index} type="link" color={link.color}>
                        {link.type}
                    </Entry>
                ))}
            </>
        );
    };

    return (
        <>
            {preview ? (
                <div className="flex flex-col justify-center text-[10px]">{getLabels()}</div>
            ) : (
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    {getLabels()}
                </View>
            )}
        </>
    );
};

export default PdfGraphLegend;
