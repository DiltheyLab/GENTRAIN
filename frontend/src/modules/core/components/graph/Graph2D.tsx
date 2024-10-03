import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods, LinkObject, NodeObject } from "react-force-graph-2d";
import { ColoringMode, ColorMap, CustomLink, CustomNode, GraphData } from "@/modules/core/types/graph";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { Loader2 } from "lucide-react";
import { useCanvasClick } from "@/modules/core/hooks/graph/useCanvasClick";
import { COLOR_FOR_CASES_WITHOUT_CLUSTERS } from "@/modules/core/helpers/colors";
import { CONTACT_LINK_VALUE } from "../../services/graph/GraphDataGenerator";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

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
    updateSelectedNode: (selectedNode: (NodeObject & CustomNode) | null) => void;
    selectedNode: (NodeObject & CustomNode) | null;
    isLoading?: boolean;
    linksBelowGeneticDistanceThreshold?: CustomLink[];
};

export const Graph2D = ({
    data,
    width,
    height,
    colorMap,
    cases,
    coloringMode,
    updateSelectedNode,
    selectedNode,
    linksBelowGeneticDistanceThreshold,
    isLoading = false,
    linkDistance = 70,
    charge = -80,
    nodeSize = 6,
    linkWidth = 2.5,
    showNodeLabel = false,
    labelTransparency = 0.3,
    coolDownTicks = 120,
    initialCenter = false,
}: Graph2DProps) => {
    const [zoomToFit, setZoomToFit] = useState(initialCenter);
    const forceRef = useRef<ForceGraphMethods>();
    const navigate = useNavigate();
    useCanvasClick([() => updateSelectedNode(null)]);

    // custom d3 force setup
    useEffect(() => {
        forceRef?.current?.d3Force("charge")?.strength(charge).distanceMax(350);
        forceRef?.current?.d3Force("link")?.distance(linkDistance);
        forceRef?.current?.d3ReheatSimulation();
    }, [linkDistance, charge, data]);

    const nodeMap = useMemo(() => {
        const map = new Map<number, CustomNode>();
        data.nodes.forEach((node) => {
            map.set(node.id, node);
        });
        return map;
    }, [data.nodes]);

    const handleEngineStop = () => {
        if (zoomToFit === false) return;
        forceRef.current?.zoomToFit(100);
        setZoomToFit(false);
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
        if (selectedNode && selectedNode.caseData.case_id === node.caseData.case_id) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw the label above the circle
        let label = `${node.caseData.case_id}`;
        // Set the label to an empty string if showNodeLabel is false
        // Info: do not return out of the function. The label should be drawn even if it is empty,
        // otherwise it leads to a rendering bug
        if (!showNodeLabel) {
            label = "";
        }
        const fontSize = 10;
        ctx.font = `${fontSize}px Merriweather`;

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
        const fontSize = 10;
        ctx.font = `${fontSize}px Merriweather`;
        ctx.fillText(link.value === CONTACT_LINK_VALUE ? "" : link.value?.toString(), midX, midY);
    };

    const drawCustomLinksBelowGeneticDistanceThreshold = (ctx: CanvasRenderingContext2D) => {
        if (!linksBelowGeneticDistanceThreshold) return;

        linksBelowGeneticDistanceThreshold.forEach((link) => {
            const sourceNode = nodeMap.get(link.source) as NodeObject & CustomNode;
            const targetNode = nodeMap.get(link.target) as NodeObject & CustomNode;

            if (!sourceNode?.x || !sourceNode?.y || !targetNode?.x || !targetNode?.y) return;

            ctx.beginPath();
            ctx.moveTo(sourceNode.x, sourceNode.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Optionally, draw the link value
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;
            ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
            ctx.font = "12px Merriweather";
            ctx.fillText(link.value?.toString() || "", midX, midY);
        });
    };

    if (isLoading) {
        return <Loader2 className="h-24 w-h-24 animate-spin" />;
    } else if (data.nodes.length === 0 && cases && cases.length >= 0) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <p>Es sind keine sequenzierten Daten vorhanden, bitte laden Sie diese in der&nbsp;</p>
                <Button
                    variant="link"
                    className="underline px-0 font-normal text-base"
                    onClick={() => navigate("/data-management")}
                >
                    Datenverwaltung
                </Button>
                <p>&nbsp; hoch.</p>
            </div>
        );
    } else if (data.links.length === 0 && data.nodes.length === 1) {
        return (
            <div className="flex flex-col p-4 text-center">
                <h4 className="text-lg font-semibold">Der ausgewählte Ausbruch besteht nur aus einem Datenpunkt.</h4>
                <p> Bitte fügen Sie weitere Daten (Background) hinzu, um den Graph zu erstellen.</p>
            </div>
        );
    }

    return (
        <ForceGraph2D
            ref={forceRef}
            graphData={data}
            nodeLabel={(node) => node.caseData.case_id}
            nodeRelSize={nodeSize}
            width={width}
            height={height}
            cooldownTicks={coolDownTicks} //number of frames until simulation ends
            backgroundColor="hsl(60, 4.8%, 95.9%)"
            d3VelocityDecay={0.2}
            onEngineStop={handleEngineStop}
            nodeCanvasObject={(node, ctx) => createCustomNodeCanvas(node as CustomNode, ctx)}
            linkCanvasObject={(link, ctx) => createCustomLinkCanvas(link as CustomLink, ctx)}
            linkCanvasObjectMode={() => "after"}
            linkCurvature={(link) => link.curvature}
            linkColor={(link) => link.color}
            linkWidth={linkWidth}
            onNodeClick={(node, _event) => updateSelectedNode(node as CustomNode & NodeObject)}
            onNodeDrag={(node) => {
                node.fx = node.x;
                node.fy = node.y;
            }}
            onNodeDragEnd={(node) => {
                node.fx = node.x;
                node.fy = node.y;
            }}
            onRenderFramePost={(ctx, _globalScale) => {
                if (selectedNode) {
                    drawCustomLinksBelowGeneticDistanceThreshold(ctx);
                }
            }}
        />
    );
};
