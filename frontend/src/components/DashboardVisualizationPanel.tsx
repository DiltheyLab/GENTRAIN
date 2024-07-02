import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ForcedDirectedGraph2D } from "./graphs/ForcedDirectedGraph";
import mst from "../data/mst-data-vasturiano.json";
import { useGraphSettings } from "@/providers/GraphSettingsProvider";
import { ForcedDirectedGraph3D } from "./graphs/ForcedDirectedGraph3D";
import { useLayoutEffect, useRef, useState } from "react";

export const DashboardVisualizationPanel = () => {
    const graphSettingsContext = useGraphSettings();

    //get size of parent container
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    setHeight(containerRef.current.offsetHeight);
    setWidth(containerRef.current.offsetWidth - 8); // substract p-1 from parent to fit
  }, [containerRef]);

  if (!graphSettingsContext) {
    return <div>Loading...</div>;
  }

  const getGraph = () => {
    if (
      graphSettingsContext.settings.graphDimension === "2D" &&
      width &&
      height
    ) {
      return (
        <ForcedDirectedGraph2D
          graphDataJSON={mst}
          width={width}
          height={height}
        />
      );
    } else if (
      graphSettingsContext.settings.graphDimension === "3D" &&
      width &&
      height
    ) {
      return (
        <ForcedDirectedGraph3D
          graphDataJSON={mst}
          width={width}
          height={height}
        />
      );
    }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted lg:col-span-2"
    >
      <Badge variant="outline" className="absolute z-50 right-3 top-3">
        {graphSettingsContext.settings.graphDimension}
      </Badge>
      <Button variant="outline" className="absolute z-50 bottom-3 right-3">
        Reset
      </Button>
      <div className="p-1">{getGraph()}</div>
    </div>
  );
};
