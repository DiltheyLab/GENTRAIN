import { useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods, LinkObject, NodeObject } from "react-force-graph-2d";
import { ColorMap, GraphData } from "@/types/graph";
import { useAnalysisStore } from "@/stores/analysis";
import { CaseWithRelationships } from "@/database/cases";
import { Loader2 } from "lucide-react";
import { COLOR_FOR_CASES_WITHOUT_OUTBREAKS } from "@/colors/colorPalettes";

type Graph2DProps = {
    data: GraphData;
    width: number;
    height: number;
    colorMap: ColorMap;
    cases: CaseWithRelationships[] | undefined;
    linkDistance?: number;
    charge?: number;
    zoomToFit?: boolean;
    nodeSize?: number;
    linkWidth?: number;
    showNodeLabel?: boolean;
    labelTransparency?: number;
    coolDownTicks?: number;
};

export const Graph2D = ({
    data,
    width,
    height,
    colorMap,
    cases,
    linkDistance = 70,
    charge = -80,
    zoomToFit = false,
    nodeSize = 6,
    linkWidth = 2.5,
    showNodeLabel = false,
    labelTransparency = 0.3,
    coolDownTicks = 120,
}: Graph2DProps) => {
    const forceRef = useRef<ForceGraphMethods>();
    const analysisStore = useAnalysisStore();

    // custom d3 force setup
    useEffect(() => {
        forceRef?.current?.d3Force("charge")?.strength(charge).distanceMax(350);
        forceRef?.current?.d3Force("link")?.distance(linkDistance);
        forceRef?.current?.d3ReheatSimulation();
    }, [linkDistance, charge, data]);

    if (data.nodes.length === 0 && analysisStore.settings.selectedOutbreak && !cases) {
        return <Loader2 className="h-24 w-h-24 animate-spin" />;
    } else if (data.nodes.length === 0 && cases && cases.length === 0) {
        return <div className="flex justify-center items-center h-full w-full">Keine Daten vorhanden</div>;
    }

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
        if (!analysisStore.graphSettings.isColoredByTimeSpan) {
            ctx.fillStyle = colorMap[node.cluster].isActive
                ? colorMap[node.cluster].color
                : COLOR_FOR_CASES_WITHOUT_OUTBREAKS;
        } else {
            ctx.fillStyle = colorMap[node.registeredAt].color;
        }
        ctx.fill();

        // Draw the label above the circle
        let label = `${node["caseId"]}`;
        // Set the label to an empty string if showNodeLabel is false
        // Info: do not return out of the function. The label should be drawn even if it is empty,
        // otherwise it leads to a rendering bug
        if (!showNodeLabel) {
            label = "";
        }
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
            nodeLabel={(node) => node.caseId}
            nodeRelSize={nodeSize}
            width={width}
            height={height}
            cooldownTicks={coolDownTicks} //number of frames until simulation ends
            backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color
            d3VelocityDecay={0.2}
            onEngineStop={handleEngineStop}
            nodeCanvasObject={(node, ctx) => createCustomNodeCanvas(node, ctx)}
            linkCanvasObject={(link, ctx) => createCustomLinkCanvas(link, ctx)}
            linkCanvasObjectMode={() => "after"}
            linkCurvature={(link) => link.curvature}
            linkColor={(link) => link.color}
            linkWidth={linkWidth}
            onNodeClick={(node, _event) => {
                forceRef?.current?.centerAt(node.x, node.y, 1000);
                forceRef?.current?.zoom(2, 1000);
            }}
            onNodeDrag={(node) => {
                node.fx = node.x;
                node.fy = node.y;
            }}
            onNodeDragEnd={(node) => {
                node.fx = node.x;
                node.fy = node.y;
            }}
        />
    );
};
