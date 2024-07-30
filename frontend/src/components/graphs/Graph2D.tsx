import { useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods, LinkObject, NodeObject } from "react-force-graph-2d";
import { GraphData } from "@/types/graph";

type Graph2DProps = {
    data: GraphData;
    width: number;
    height: number;
    linkDistance?: number;
    charge?: number;
    zoomToFit?: boolean;
    nodeSize?: number;
    linkWidth?: number;
    hideNodeLabel?: boolean;
    labelTransparency?: number;
    coolDownTicks?: number;
};

export const Graph2D = ({
    data,
    width,
    height,
    linkDistance = 50,
    charge = -80,
    zoomToFit = false,
    nodeSize = 6,
    linkWidth = 3,
    hideNodeLabel = false,
    labelTransparency = 0.3,
    coolDownTicks = 120,
}: Graph2DProps) => {
    const forceRef = useRef<ForceGraphMethods>();

    // custom d3 force setup
    useEffect(() => {
        if (!forceRef.current || !charge || !linkDistance) return;
        forceRef.current.d3Force("charge")?.strength(charge);
        forceRef.current.d3Force("link")?.distance(linkDistance);
        forceRef.current.d3ReheatSimulation();
    }, [linkDistance, charge]);

    const handleEngineStop = () => {
        if (!forceRef.current) return;
        if (zoomToFit === false) return;
        forceRef.current?.zoomToFit(100);
    };

    const createCustomNodeCanvas = (node: NodeObject, ctx: CanvasRenderingContext2D) => {
        if (!node.x || !node.y) return;

        const radius = nodeSize;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw the label if setting is not hidden
        if (hideNodeLabel) return;

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
        ctx.fillStyle = `rgb(0, 0, 0,${labelTransparency})`;
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
        ctx.lineWidth = linkWidth;
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

    if (data.links.length === 0 && data.nodes.length === 1) {
        return (
            <div className="flex flex-col p-4 text-center">
                <h4 className="text-lg font-semibold">Der ausgewählte Ausbruch besteht nur aus einem Datenpunkt.</h4>
                <p> Bitte füge weitere Daten (Background) hinzu, um den Graph zu erstellen.</p>
            </div>
        );
    }

    return (
        <ForceGraph2D
            ref={forceRef}
            graphData={data}
            nodeLabel={(node) => `${node["caseId"]}`}
            nodeRelSize={nodeSize}
            width={width}
            height={height}
            cooldownTicks={coolDownTicks} //number of frames until simulation ends
            backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color
            linkLabel={(link) => `${link.value}`}
            linkWidth={linkWidth}
            d3VelocityDecay={0.3}
            onEngineStop={handleEngineStop}
            nodeCanvasObject={(node, ctx) => createCustomNodeCanvas(node, ctx)}
            linkCanvasObject={(link, ctx) => createCustomLinkCanvas(link, ctx)}
        />
    );
};
