import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ForcedDirectedGraph2D } from "./graphs/ForcedDirectedGraph";
import { GraphData, useGraphSettings } from "@/providers/GraphSettingsProvider";
import { ForcedDirectedGraph3D } from "./graphs/ForcedDirectedGraph3D";
import { useEffect, useMemo, useRef, useState } from "react";
import { deepCopyData } from "@/lib/utils";
import { transformDistanceMatrixToGraphData } from "@/services/graphs";
import { useDistanceMatrixAndSamplesGetById } from "@/database/distance_matrix";

export const DashboardVisualizationPanel = () => {
    const graphSettingsContext = useGraphSettings();
    const matrixDataWithMetaData = useDistanceMatrixAndSamplesGetById("dm_full");

    //get size of parent container
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!matrixDataWithMetaData || !matrixDataWithMetaData.distanceMatrix || !graphSettingsContext) return;
        const graphData = transformDistanceMatrixToGraphData(
            matrixDataWithMetaData.distanceMatrix,
            matrixDataWithMetaData.samples
        );

        // Update the graph settings with the new graph data
        graphSettingsContext.updateSettings({ graphData });
    }, [matrixDataWithMetaData]);

    useEffect(() => {
        if (!containerRef.current) return;
        setHeight(containerRef.current.offsetHeight);
        setWidth(containerRef.current.offsetWidth - 8); // substract padding from parent to fit
    }, [containerRef]);

    useEffect(() => {
        const onResize = () => {
            if (!containerRef.current) return;
            setWidth(containerRef.current.offsetWidth - 8);
        };
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

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
            <Button variant="outline" className="absolute z-50 bottom-3 right-3">
                Reset
            </Button>
            <div className="p-1 flex justify-center items-center h-full w-full" id="graph-container">
                {getGraph()}
            </div>
        </div>
    );
};
