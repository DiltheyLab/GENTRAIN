import { useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods, LinkObject, NodeObject } from "react-force-graph-2d";
import { ColoringMode, ColorMap, CustomLink, CustomNode, GraphData } from "@/modules/core/types/graph";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { Loader2 } from "lucide-react";
import { useCanvasClick } from "@/modules/core/hooks/graph/useCanvasClick";
import { COLOR_FOR_CASES_WITHOUT_CLUSTERS } from "@/modules/core/helpers/colors";

type Graph2DProps = {
    data: GraphData;
    width: number;
    height: number;
    colorMap: ColorMap;
    cases: CaseWithRelationships[] | undefined;
    coloringMode: ColoringMode;
    linkDistance?: number;
    charge?: number;
    nodeSize?: number;
    linkWidth?: number;
    showNodeLabel?: boolean;
    labelTransparency?: number;
    coolDownTicks?: number;
    initialCenter?: boolean;
    updateSelectedCase: (selectedCase: CaseWithRelationships | null) => void;
    selectedCase: CaseWithRelationships | null;
    exportPdfOnEngineStop: () => void;
};

export const GraphPdf = ({
    data,
    width,
    height,
    colorMap,
    cases,
    coloringMode,
    updateSelectedCase,
    linkDistance = 70,
    charge = -80,
    nodeSize = 6,
    linkWidth = 2.5,
    coolDownTicks = 120,
    exportPdfOnEngineStop,
}: Graph2DProps) => {
    const forceRef = useRef<ForceGraphMethods>();
    useCanvasClick(updateSelectedCase);

    // custom d3 force setup
    useEffect(() => {
        forceRef?.current?.d3Force("charge")?.strength(charge).distanceMax(350);
        forceRef?.current?.d3Force("link")?.distance(linkDistance);
        forceRef?.current?.d3ReheatSimulation();
    }, [linkDistance, charge, data]);

    if (data.nodes.length === 0 && !cases) {
        return <Loader2 className="h-24 w-h-24 animate-spin" />;
    } else if (data.nodes.length === 0 && cases && cases.length >= 0) {
        return <div className="flex justify-center items-center h-full w-full">Keine Daten vorhanden</div>;
    }

    const handleEngineStop = () => {
        forceRef.current?.zoomToFit();
        exportPdfOnEngineStop();
    };

    const createCustomNodeCanvas = (node: CustomNode & NodeObject, ctx: CanvasRenderingContext2D) => {
        if (!node.x || !node.y) return;
        const radius = nodeSize;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);

        if (coloringMode === "timeSpan") {
            ctx.fillStyle = colorMap[node.registeredAt].color;
        } else {
            ctx.fillStyle = colorMap[node.cluster]?.isActive
                ? colorMap[node.cluster].color
                : COLOR_FOR_CASES_WITHOUT_CLUSTERS;
        }
        ctx.fill();

        // Draw the label above the circle
        let label = `${node.index}`;
        const fontSize = 12;
        ctx.font = `${fontSize}px Merriweather`;
        // Draw the text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        //font bold
        ctx.fillText(label, node.x, node.y);
    };

    const createCustomLinkCanvas = (link: LinkObject & CustomLink, ctx: CanvasRenderingContext2D) => {
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
        ctx.font = `light ${fontSize}px Merriweather`;
        ctx.fillText(link.value.toString(), midX, midY);
    };

    if (data.links.length === 0 && data.nodes.length === 1) {
        return (
            <div className="flex flex-col p-4 text-center">
                <h4 className="text-lg font-semibold">Der ausgewählte Ausbruch besteht nur aus einem Datenpunkt.</h4>
                <p> Bitte fügen Sie weitere Daten (Background) hinzu, um den Graph zu erstellen.</p>
            </div>
        );
    }

    const handleNodeClick = (node: NodeObject & CustomNode) => {
        // Center the graph on the selected node
        // forceRef?.current?.centerAt(node.x, node.y, 1000);
        // forceRef?.current?.zoom(2, 1000);
        updateSelectedCase(node.caseData);
    };

    return (
        <ForceGraph2D
            ref={forceRef}
            graphData={data}
            nodeLabel={(node) => node.index}
            nodeRelSize={nodeSize}
            width={width}
            height={height}
            cooldownTicks={coolDownTicks}
            backgroundColor="#FFFFFF"
            d3VelocityDecay={0.2}
            onEngineStop={handleEngineStop}
            nodeCanvasObject={(node, ctx) => createCustomNodeCanvas(node as CustomNode, ctx)}
            linkCanvasObject={(link, ctx) => createCustomLinkCanvas(link as CustomLink, ctx)}
            linkCanvasObjectMode={() => "after"}
            linkCurvature={(link) => link.curvature}
            linkColor={(link) => link.color}
            linkWidth={linkWidth}
            onNodeClick={(node, _event) => handleNodeClick(node as CustomNode)}
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
