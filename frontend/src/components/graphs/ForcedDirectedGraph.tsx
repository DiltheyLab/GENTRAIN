import { deepCopyData } from "@/lib/utils";
import { useGraphSettings } from "@/providers/GraphSettingsProvider";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d";

interface Node extends NodeObject {
    group: string;
    color: string;
}
type Link = {
    source: string;
    target: string;
    value: number;
};

type Data = {
    nodes: any[];
    links: any[];
};

type ForcedDirectedGraph2DProps = {
    graphDataJSON: Data;
    width: number;
    height: number;
};

<<<<<<< HEAD
export const ForcedDirectedGraph2D = ({
  graphDataJSON,
  width,
  height,
}: ForcedDirectedGraph2DProps) => {
  const graphSettingsContext = useGraphSettings();
=======
export const ForcedDirectedGraph2D = ({ graphDataJSON, width, height }: ForcedDirectedGraph2DProps) => {
    const graphSettingsContext = useGraphSettings();
>>>>>>> main

    //copy the data to avoid mutation of the original data
    const [data, setData] = useState(deepCopyData(graphDataJSON));

    // set ref to use own d3 force simulation
    const forceRef = useRef<ForceGraphMethods>();

    if (!graphSettingsContext) {
        return <div>Loading...</div>;
    }

<<<<<<< HEAD
  // custom d3 force setup
  useEffect(() => {
    if (!forceRef.current) return;
    forceRef.current
      .d3Force("charge")
      ?.strength(graphSettingsContext.settings.charge);
    forceRef.current
      .d3Force("link")
      ?.distance(graphSettingsContext.settings.linkDistance);

    forceRef.current.d3ReheatSimulation();
  });
=======
    // custom d3 force setup
    useEffect(() => {
        if (!forceRef.current) return;
        forceRef.current.d3Force("charge")?.strength(-50);
        forceRef.current.d3Force("center");
    });
>>>>>>> main

    const handleEngineStop = () => {
        if (!forceRef.current) return;
        if (graphSettingsContext.settings.zoomToFit === false) return;
        forceRef.current?.zoomToFit(400);
    };

<<<<<<< HEAD
  const createCustomNodeCanvas = (
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    if (!node.x || !node.y) return;
=======
    const createCustomNodeCanvas = (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
        if (!node.x || !node.y) return;
>>>>>>> main

        // Always draw the circle regardless of hideNodeLabel setting
        const radius = graphSettingsContext.settings.nodeSize;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw the label if setting is not hidden
        if (graphSettingsContext.settings.hideNodeLabel) return;

        // Draw the label above the circle
        const label = `${node.id}`;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.3); // some padding

        // Adjust label position to be above the circle
        const labelY = node.y - radius - bckgDimensions[1] * 1; // Adjust this value as needed to position the label above the circle

        // Draw the text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(label, node.x, labelY + bckgDimensions[1] / 2);
    };

<<<<<<< HEAD
  return (
    <ForceGraph2D
      ref={forceRef}
      graphData={data}
      nodeLabel={(node) => `(${node.id})`}
      nodeRelSize={graphSettingsContext.settings.nodeSize}
      width={width}
      height={height}
      cooldownTicks={100}
      backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color
      onEngineStop={handleEngineStop}
      linkLabel={(link) => {
        return `${link.value}`;
      }}
      linkWidth={graphSettingsContext.settings.linkWidth}
      d3VelocityDecay={0.3}
      nodeCanvasObject={(node, ctx, globalScale) =>
        createCustomNodeCanvas(node, ctx, globalScale)
      }
    />
  );
=======
    return (
        <ForceGraph2D
            ref={forceRef}
            graphData={data}
            nodeLabel={(node) => `(${node.id})`}
            nodeRelSize={graphSettingsContext.settings.nodeSize}
            width={width}
            height={height}
            cooldownTicks={100}
            backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color
            onEngineStop={handleEngineStop}
            linkLabel={(link) => {
                return `${link.value}`;
            }}
            linkWidth={graphSettingsContext.settings.linkWidth}
            d3VelocityDecay={0.3}
            nodeCanvasObject={(node, ctx, globalScale) => createCustomNodeCanvas(node, ctx, globalScale)}
        />
    );
>>>>>>> main
};
