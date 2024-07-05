import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ForcedDirectedGraph2D } from "./graphs/ForcedDirectedGraph";
import { GraphData, useGraphSettings } from "@/providers/GraphSettingsProvider";
import { ForcedDirectedGraph3D } from "./graphs/ForcedDirectedGraph3D";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { deepCopyData } from "@/lib/utils";
import { exportGraphAndInformationAsPdf } from "@/services/pdf";

export const DashboardVisualizationPanel = () => {
    const graphSettingsContext = useGraphSettings();
    //get size of parent container
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;
        setHeight(containerRef.current.offsetHeight);
        setWidth(containerRef.current.offsetWidth - 8); // substract padding from parent to fit
    }, [containerRef]);

    if (!graphSettingsContext) {
        return <div>Loading...</div>;
    }

    // Creating deep copy of the graph data for each graph component and
    // use useMemo hook to safe the graphData with updated simulation data to prevent to start simulation
    // from beginning after every rerendering

    const graphDataCopy = useMemo(() => {
        return deepCopyData(graphSettingsContext.settings.graphData);
    }, [graphSettingsContext.settings.graphData]);

    const getGraph = () => {
        if (graphSettingsContext.settings.graphDimension === "2D" && width && height) {
            return <ForcedDirectedGraph2D data={graphDataCopy as GraphData} width={width} height={height} />;
        } else if (graphSettingsContext.settings.graphDimension === "3D" && width && height) {
            return <ForcedDirectedGraph3D data={graphDataCopy as GraphData} width={width} height={height} />;
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted lg:col-span-2"
        >
            <Badge variant="outline" className="absolute z-50 right-3 top-3">
                {graphSettingsContext.settings.graphDimension}
            </Badge>
            <Button
                variant="outline"
                className="absolute z-50 bottom-3 left-3"
                onClick={() => {
                    exportGraphAndInformationAsPdf();
                }}
            >
                Export PDF
            </Button>
            <Button variant="outline" className="absolute z-50 bottom-3 right-3">
                Reset
            </Button>
            <div className="p-1 flex justify-center items-center h-full w-full" id="graph-container">
                {getGraph()}
            </div>
        </div>
    );
};
