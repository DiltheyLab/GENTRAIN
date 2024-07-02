import { useGraphSettings } from "@/providers/GraphSettingsProvider";
import { useEffect, useRef } from "react";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";

type nodes = {
    id: string;
    group: string;
    color: string;
};
type links = {
    source: string;
    target: string;
    value: number;
};

type Data = {
    nodes: any[];
    links: any[];
};

type ForcedDirectedGraph3DProps = {
    graphDataJSON: Data;
    width: number;
    height: number;
};

<<<<<<< HEAD
export const ForcedDirectedGraph3D = ({
  graphDataJSON,
  width,
  height,
}: ForcedDirectedGraph3DProps) => {
  const graphSettingsContext = useGraphSettings();
=======
export const ForcedDirectedGraph3D = ({ graphDataJSON, width, height }: ForcedDirectedGraph3DProps) => {
    const graphSettingsContext = useGraphSettings();
>>>>>>> main

    // set ref to use own d3 force simulation
    const forceRef = useRef<ForceGraphMethods>();

    if (!graphSettingsContext) {
        return <div>Loading...</div>;
    }

    //copy the data
    const data = JSON.parse(JSON.stringify(graphDataJSON));

    const handleEngineStop = () => {
        if (!forceRef.current) return;
        if (graphSettingsContext.settings.zoomToFit === false) return;
        forceRef.current?.zoomToFit(100);
    };

<<<<<<< HEAD
  useEffect(() => {
    if (!forceRef.current) return;
    forceRef.current
      .d3Force("charge")
      ?.strength(graphSettingsContext.settings.charge);
    forceRef.current.d3ReheatSimulation();
  });

  return (
    <ForceGraph3D
      graphData={data}
      ref={forceRef}
      nodeLabel={(node) => {
        return `<div style="color: black;">(${node.id})</div>`;
      }}
      nodeOpacity={0.9}
      width={width}
      height={height}
      backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color bg-muted
      nodeRelSize={graphSettingsContext.settings.nodeSize}
      linkLabel={(link) => {
        return `${link.value}`;
      }}
      nodeColor={(node) => {
        return node.color;
      }}
      linkWidth={graphSettingsContext.settings.linkWidth}
      linkColor="black"
      linkOpacity={0.7}
      cooldownTicks={100}
      onEngineStop={handleEngineStop}
      showNavInfo={false}
    />
  );
=======
    return (
        <ForceGraph3D
            graphData={data}
            ref={forceRef}
            nodeLabel={(node) => {
                return `<div style="color: black;">(${node.id})</div>`;
            }}
            nodeOpacity={0.9}
            width={width}
            height={height}
            backgroundColor="hsl(60, 4.8%, 95.9%)" // replace with theme color bg-muted
            nodeRelSize={graphSettingsContext.settings.nodeSize}
            linkLabel={(link) => {
                return `${link.value}`;
            }}
            nodeColor={(node) => {
                return node.color;
            }}
            linkWidth={graphSettingsContext.settings.linkWidth}
            linkColor="black"
            linkOpacity={0.7}
            cooldownTicks={100}
            onEngineStop={handleEngineStop}
            showNavInfo={false}
        />
    );
>>>>>>> main
};
