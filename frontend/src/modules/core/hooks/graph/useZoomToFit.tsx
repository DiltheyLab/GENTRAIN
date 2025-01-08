import { useEffect, useState } from "react";

export const useZoomToFit = (initialZoomToFit: boolean, zoomToFitTriggers: Array<any>) => {
    const [zoomToFit, setZoomToFit] = useState(initialZoomToFit);

    //listens to triggers which can activate a zoom out
    useEffect(() => {
        if (zoomToFitTriggers.length === 0) return;
        setZoomToFit(true);
    }, zoomToFitTriggers);

    return [zoomToFit, setZoomToFit] as const;
};
