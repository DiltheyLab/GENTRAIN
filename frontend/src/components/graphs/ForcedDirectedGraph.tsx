import { useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods, LinkObject, NodeObject } from "react-force-graph-2d";
import { type GraphData, useGraphStore } from "@/stores/graph";

type ForcedDirectedGraph2DProps = {
    data: GraphData;
    width: number;
    height: number;
};

export const ForcedDirectedGraph2D = ({ data, width, height }: ForcedDirectedGraph2DProps) => {
    const graphSettingsContext = useGraphStore();
    const forceRef = useRef<ForceGraphMethods>();

    // custom d3 force setup
    useEffect(() => {
        if (!forceRef.current || !graphSettingsContext) return;
        forceRef.current.d3Force("charge")?.strength(graphSettingsContext.settings.charge);
        forceRef.current.d3Force("link")?.distance(graphSettingsContext.settings.linkDistance);

        forceRef.current.d3ReheatSimulation();
    }, [graphSettingsContext?.settings.charge, graphSettingsContext?.settings.linkDistance]);

    if (!graphSettingsContext) {
        return <div>Loading...</div>;
    }

    const handleEngineStop = () => {
        if (!forceRef.current) return;
        if (graphSettingsContext.settings.zoomToFit === false) return;
        forceRef.current?.zoomToFit(400);
    };

    const createCustomNodeCanvas = (node: NodeObject, ctx: CanvasRenderingContext2D) => {
        if (!node.x || !node.y) return;

        // Always draw the circle regardless of hideNodeLabel setting
        const radius = graphSettingsContext.settings.nodeSize;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw the label if setting is not hidden
        if (graphSettingsContext.settings.hideNodeLabel) return;

        // Draw the label above the circle
        const label = `${node["caseId"]}`;
        const fontSize = 12;
        ctx.font = `bold ${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.3); // some padding

        // Adjust label position to be above the circle
        const labelY = node.y - radius - bckgDimensions[1] * 1; // Adjust this value as needed to position the label above the circle

        // Draw the text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        //font bold
        ctx.fillText(label, node.x, labelY + bckgDimensions[1] / 2);
    };

    const createCustomLinkCanvas = (link: LinkObject, ctx: CanvasRenderingContext2D) => {
        if (!link.source || !link.target) return;
        // Get the source and target nodes
        const source = link.source as NodeObject;
        const target = link.target as NodeObject;

        // Check if the source and target nodes have x and y values
        if (!source.x || !source.y || !target.x || !target.y) return;

        // Start line
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);

        // End line
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = "#CCC"; // Line color
        ctx.lineWidth = graphSettingsContext.settings.linkWidth; // Line width based on link value and scale
        ctx.stroke();

        // Calculate midpoint for text
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        // Draw text at midpoint
        ctx.fillStyle = "black"; // Text color
        const fontSize = 12;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.fillText(link.value.toString(), midX, midY);
    };

    return (
        <ForceGraph2D
            ref={forceRef}
            graphData={data}
            nodeLabel={(node) => `(${node["caseId"]})`}
            nodeRelSize={graphSettingsContext?.settings.nodeSize}
            width={width}
            height={height}
            cooldownTicks={100} //number of frames until simulation ends
            backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color
            onEngineStop={handleEngineStop}
            linkLabel={(link) => `${link.value}`}
            linkWidth={graphSettingsContext?.settings.linkWidth}
            d3VelocityDecay={0.3}
            nodeCanvasObject={(node, ctx) => createCustomNodeCanvas(node, ctx)}
            linkCanvasObject={(link, ctx) => createCustomLinkCanvas(link, ctx)}
        />
    );
};
