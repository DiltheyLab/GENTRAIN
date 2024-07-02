import { deepCopyData } from "@/lib/utils";
import { useDashboard } from "@/providers/DashboardProvider";
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

export const ForcedDirectedGraph2D = ({
  graphDataJSON,
  width,
  height,
}: ForcedDirectedGraph2DProps) => {
  const dashboardContext = useDashboard();

  //copy the data to avoid mutation of the original data
  const [data, setData] = useState(deepCopyData(graphDataJSON));

  // set ref to use own d3 force simulation
  const forceRef = useRef<ForceGraphMethods>();

  if (!dashboardContext) {
    return <div>Loading...</div>;
  }

  // custom d3 force setup
  useEffect(() => {
    console.log(dashboardContext.settings.forceCharge);
    if (!forceRef.current) return;
    forceRef.current.d3Force("charge")?.strength(-50);
    forceRef.current.d3Force("center");
  });

  const handleEngineStop = () => {
    if (!forceRef.current) return;
    if (dashboardContext.settings.zoomToFit === false) return;
    forceRef.current?.zoomToFit(400);
  };

  const createCustomNodeCanvas = (
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    if (!node.x || !node.y) return;

    if (!dashboardContext.settings.showIdAsNode) {
      const radius = dashboardContext.settings.nodeSize;
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle =
        node.group === "Outbreak 1" ? "hsl(137.508,50%,75%)" : "hsl(0,50%,75%)";
      ctx.fill();
    } else {
      // Draw the label with background as currently implemented
      const label = `${node.id}`;
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(
        (n) => n + fontSize * 0.3
      ); // some padding

      ctx.fillStyle = node.color;
      ctx.fillRect(
        node.x! - bckgDimensions[0] / 2,
        node.y! - bckgDimensions[1] / 2,
        bckgDimensions[0],
        bckgDimensions[1]
      );
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.fillText(label, node.x!, node.y!);
      node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
    }
  };

  return (
    <ForceGraph2D
      ref={forceRef}
      graphData={data}
      nodeLabel={(node) => `(${node.id})`}
      nodeRelSize={dashboardContext.settings.nodeSize}
      width={width}
      height={height}
      cooldownTicks={100}
      backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color
      onEngineStop={handleEngineStop}
      linkLabel={(link) => {
        return `${link.value}`;
      }}
      linkWidth={dashboardContext.settings.linkWidth}
      d3VelocityDecay={0.3}
      nodeCanvasObject={(node, ctx, globalScale) =>
        createCustomNodeCanvas(node, ctx, globalScale)
      }
    />
  );
};

/*
nodeCanvasObject={(node, ctx, globalScale) => {
          if (useCircles) {
            // Draw a circle
            const radius = 5; // Set the radius of your circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.group === "Outbreak 1" ? "hsl(137.508,50%,75%)" : "hsl(0,50%,75%)";
            ctx.fill();
          } else {
            // Draw the label with background as currently implemented
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

            ctx.fillStyle = node.color;
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x, node.y);
            node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
          }
        }} 
*/
