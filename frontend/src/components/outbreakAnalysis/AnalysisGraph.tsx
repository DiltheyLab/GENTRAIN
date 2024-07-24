import { useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods, LinkObject, NodeObject } from "react-force-graph-2d";
import { type GraphData } from "@/stores/graph";

type AnalysisGraphProps = {
    data: GraphData;
    width: number;
    height: number;
};

export const AnalysisGraph = ({ data, width, height }: AnalysisGraphProps) => {
    const forceRef = useRef<ForceGraphMethods>();

    // custom d3 force setup
    useEffect(() => {
        if (!forceRef.current) return;
        forceRef.current.d3Force("charge")?.strength(-40);
        forceRef.current.d3Force("link")?.distance(50);
    }, []);

    const createCustomNodeCanvas = (node: NodeObject, ctx: CanvasRenderingContext2D) => {
        if (!node.x || !node.y) return;

        const radius = 6;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color;
        ctx.fill();

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
        ctx.fillStyle = "rgb(0, 0, 0,0.1)";
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
        ctx.lineWidth = 3;
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
            nodeLabel={(node) => `${node["caseId"]}`}
            nodeRelSize={6}
            width={width}
            height={height}
            cooldownTicks={100} //number of frames until simulation ends
            backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color
            linkLabel={(link) => `${link.value}`}
            linkWidth={3}
            d3VelocityDecay={0.3}
            nodeCanvasObject={(node, ctx) => createCustomNodeCanvas(node, ctx)}
            linkCanvasObject={(link, ctx) => createCustomLinkCanvas(link, ctx)}
        />
    );
};
