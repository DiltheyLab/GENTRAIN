import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ForceGraph2D, { ForceGraphMethods, LinkObject, NodeObject } from "react-force-graph-2d";
import { Loader2 } from "lucide-react";

import { ColoringMode, ColorMap, CustomLink, CustomNode, GraphData } from "@/modules/core/types/graph";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { useCanvasClick } from "@/modules/core/hooks/graph/useCanvasClick";
import { COLOR_FOR_CASES_WITHOUT_CLUSTERS } from "@/modules/core/helpers/colors";
import { CONTACT_LINK_VALUE } from "../../services/graph/GraphDataGenerator";
import { Button } from "../ui/Button";
import { useZoomToFit } from "../../hooks/graph/useZoomToFit";
import { usePostHog } from "posthog-js/react";
import { useManualZoomToFit } from "../../hooks/graph/useManualZoomToFit";

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
    initialZoomToFit?: boolean;
    updateSelectedNode: (selectedNode: (NodeObject & CustomNode) | null) => void;
    selectedNode: (NodeObject & CustomNode) | null;
    isLoading?: boolean;
    linksBelowGeneticDistanceThreshold?: CustomLink[];
    zoomToFitTriggers?: Array<any>;
    geneticDistanceThreshold?: number;
    zoomToFitToggle?: boolean;
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
    geneticDistanceThreshold,
    isLoading = false,
    linkDistance = 70,
    charge = -80,
    nodeSize = 6,
    linkWidth = 2.5,
    showNodeLabel = false,
    labelTransparency = 0.3,
    coolDownTicks = 120,
    initialZoomToFit = false,
    zoomToFitTriggers = [],
    zoomToFitToggle = false,
}: Graph2DProps) => {
    const hasUnsequencedData = data.nodes.length === 0 && cases && cases.length >= 0;
    const hasOnlySingleDataPoint = data.links.length === 0 && data.nodes.length === 1;
    const [zoomToFit, setZoomToFit] = useZoomToFit(initialZoomToFit, zoomToFitTriggers);
    useManualZoomToFit(zoomToFitToggle, () => handleZoomToFit());
    const forceRef = useRef<ForceGraphMethods>();
    const navigate = useNavigate();
    const posthog = usePostHog();
    useCanvasClick([() => updateSelectedNode(null), () => posthog?.capture("graph_canvas_clicked")]);

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

    // zoom out once after engine stops to show the whole graph
    const handleEngineStop = () => {
        if (zoomToFit === false) return;
        handleZoomToFit();
        setZoomToFit(false);
    };

    const handleZoomToFit = () => {
        forceRef.current?.zoomToFit(100);
    };

    const createCustomNodeCanvas = (node: CustomNode & NodeObject, ctx: CanvasRenderingContext2D) => {
        if (!node.x || !node.y) return;
        const radius = nodeSize;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);

        //switch node color for timespan and clustering/outbreaks
        if (coloringMode === "timeSpan") {
            ctx.fillStyle = colorMap[node.registeredAt].color;
        } else {
            ctx.fillStyle = colorMap[node.cluster]?.isActive
                ? colorMap[node.cluster].color
                : COLOR_FOR_CASES_WITHOUT_CLUSTERS;
        }
        ctx.fill();

        // circle around selected node
        if (selectedNode && selectedNode.caseData.case_id === node.caseData.case_id) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
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
        ctx.fillText(label, node.x, labelY + bckgDimensions[1] / 2);
    };

    const createCustomLinkCanvas = (link: LinkObject & CustomLink, ctx: CanvasRenderingContext2D) => {
        if (!link.source || !link.target) return;

        const source = link.source as NodeObject;
        const target = link.target as NodeObject;

        if (!source.x || !source.y || !target.x || !target.y) return;

        // Calculate midpoint for text
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        // Draw text at midpoint
        ctx.fillStyle = "black"; // Text color
        ctx.font = `10px Merriweather`;
        ctx.fillText(link.value === CONTACT_LINK_VALUE ? "" : link.value?.toString(), midX, midY);
    };

    const drawCustomLinksBelowGeneticDistanceThreshold = (ctx: CanvasRenderingContext2D) => {
        if (!linksBelowGeneticDistanceThreshold) return;

        linksBelowGeneticDistanceThreshold.forEach((link) => {
            // Get nodes as sources and targets instead of node ids
            const sourceNode = nodeMap.get(link.source) as NodeObject & CustomNode;
            const targetNode = nodeMap.get(link.target) as NodeObject & CustomNode;

            if (!sourceNode?.x || !sourceNode?.y || !targetNode?.x || !targetNode?.y) return;

            // Draw a dashed line between the source and target nodes
            ctx.beginPath();
            ctx.setLineDash([3, 2]);
            ctx.moveTo(sourceNode.x, sourceNode.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw the link value at the midpoint of the line
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;
            ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
            ctx.font = "10px Merriweather";
            ctx.fillText(link.value?.toString() || "", midX, midY);
        });
    };

    const handleNodeDrag = (node: NodeObject) => {
        node.fx = node.x;
        node.fy = node.y;
    };

    const renderNoSequencedDataMessage = () => {
        return (
            <div className="flex justify-center items-center">
                <p>
                    Es sind <strong>keine sequenzierten Daten vorhanden</strong>, bitte laden Sie diese in der&nbsp;
                </p>
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
    };

    const renderSingleDataPointMessage = () => {
        return (
            <div className="flex flex-col p-4 text-center">
                <h4 className="text-lg font-semibold">Der ausgewählte Ausbruch besteht nur aus einem Datenpunkt.</h4>
                <p> Bitte fügen Sie weitere Umgebungsdaten hinzu, um den Graph zu erstellen.</p>
            </div>
        );
    };

    if (isLoading) {
        return <Loader2 className="h-24 w-h-24 animate-spin" />;
    } else if (hasUnsequencedData) {
        return renderNoSequencedDataMessage();
    } else if (hasOnlySingleDataPoint) {
        return renderSingleDataPointMessage();
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
            linkLineDash={(link) => {
                if (!geneticDistanceThreshold) return [];
                return link.value <= geneticDistanceThreshold ? [] : [5, 5];
            }}
            onNodeClick={(node, _event) => {
                updateSelectedNode(node as CustomNode & NodeObject);
                posthog?.capture("graph_node_clicked", {
                    node: node,
                });
            }}
            onNodeDrag={handleNodeDrag}
            onNodeDragEnd={(node) => {
                handleNodeDrag(node);
                posthog?.capture("graph_node_draged", {
                    node: node,
                });
            }}
            onRenderFramePost={(ctx, _globalScale) => {
                if (selectedNode) {
                    drawCustomLinksBelowGeneticDistanceThreshold(ctx);
                }
            }}
        />
    );
};
