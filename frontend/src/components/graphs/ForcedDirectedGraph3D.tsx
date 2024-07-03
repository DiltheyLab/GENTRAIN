import { useGraphSettings } from "@/providers/GraphSettingsProvider";
import { useEffect, useRef } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import type { GraphData } from "@/providers/GraphSettingsProvider";

type ForcedDirectedGraph3DProps = {
    data: GraphData;
    width: number;
    height: number;
};

export const ForcedDirectedGraph3D = ({ data, width, height }: ForcedDirectedGraph3DProps) => {
    const graphSettingsContext = useGraphSettings();

    // set ref to use own d3 force simulation
    const forceRef = useRef<ForceGraphMethods>();

    if (!graphSettingsContext) {
        return <div>Loading...</div>;
    }

    if (data.nodes.length === 0) {
        return <div>Es sind keine Knoten vorhanden</div>;
    }

    const handleEngineStop = () => {
        if (!forceRef.current) return;
        if (graphSettingsContext.settings.zoomToFit === false) return;
        forceRef.current?.zoomToFit(100);
    };

    useEffect(() => {
        if (!forceRef.current) return;
        forceRef.current.d3Force("charge")?.strength(graphSettingsContext.settings.charge);
        forceRef.current.d3Force("link")?.distance(graphSettingsContext.settings.linkDistance);

        forceRef.current.d3ReheatSimulation();
    }, [graphSettingsContext.settings.charge, graphSettingsContext.settings.linkDistance]);

    return (
        <ForceGraph3D
            graphData={data}
            ref={forceRef}
            nodeLabel={(node) => {
                return `<div style="color: black;">(${node.id})</div>`;
            }}
            nodeOpacity={0.9}
            width={width}
            height={height}
            backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color bg-muted
            nodeRelSize={graphSettingsContext.settings.nodeSize}
            linkLabel={(link) => {
                return `${link.value}`;
            }}
            nodeColor={(node) => {
                return node.color;
            }}
            linkWidth={graphSettingsContext.settings.linkWidth}
            linkColor="black"
            linkOpacity={0.7}
            cooldownTicks={100}
            onEngineStop={handleEngineStop}
            showNavInfo={false}
        />
    );
};
