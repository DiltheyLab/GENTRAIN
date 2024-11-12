import { useEffect } from "react";

export const useZoomToFit = (zoomToFitTriggers: Array<any>, updateZoomToFit: () => void) => {
    //listens to triggers which can activate a zoom out
    useEffect(() => {
        if (zoomToFitTriggers.length === 0) return;
        updateZoomToFit();
    }, zoomToFitTriggers);
};
