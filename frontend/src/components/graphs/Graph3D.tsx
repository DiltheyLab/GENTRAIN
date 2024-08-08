import { useEffect, useRef } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import { GraphData } from "@/types/graph";

type Graph3DProps = {
    data: GraphData;
    width: number;
    height: number;
    linkDistance?: number;
    charge?: number;
    zoomToFit?: boolean;
    nodeSize?: number;
    linkWidth?: number;
    showNodeLabel?: boolean;
    labelTransparency?: number;
    coolDownTicks?: number;
};

export const Graph3D = ({
    data,
    width,
    height,
    linkDistance = 50,
    charge = -80,
    zoomToFit = false,
    nodeSize = 6,
    linkWidth = 3,
}: Graph3DProps) => {
    // set ref to use own d3 force simulation
    const forceRef = useRef<ForceGraphMethods>();

    const handleEngineStop = () => {
        if (!forceRef.current) return;
        if (zoomToFit === false) return;
        forceRef.current?.zoomToFit(100);
    };

    useEffect(() => {
        if (!forceRef.current) return;
        forceRef.current.d3Force("charge")?.strength(charge);
        forceRef.current.d3Force("link")?.distance(linkDistance);

        forceRef.current.d3ReheatSimulation();
    }, [charge, linkDistance]);

    return (
        <ForceGraph3D
            graphData={data}
            ref={forceRef}
            nodeLabel={(node) => {
                return `<div style="color: black;">(${node["caseId"]})</div>`;
            }}
            nodeOpacity={0.9}
            width={width}
            height={height}
            backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color bg-muted
            nodeRelSize={nodeSize}
            linkLabel={(link) => {
                return `${link.value}`;
            }}
            nodeColor={(node) => {
                return node.color;
            }}
            linkWidth={linkWidth}
            linkColor="black"
            linkOpacity={0.7}
            cooldownTicks={100}
            onEngineStop={handleEngineStop}
            showNavInfo={false}
        />
    );
};
