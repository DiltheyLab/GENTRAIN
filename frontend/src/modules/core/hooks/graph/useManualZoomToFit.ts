import { useEffect, useRef } from "react";

export const useManualZoomToFit = (zoomToFitToggle: boolean, handleZoomToFit: () => void) => {
    const isInitialRender = useRef(true);

    // zoom out directly if user triggers it manually
    useEffect(() => {
        // skip initial-render so function is only called if dependecy is changing and not after inital render
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        handleZoomToFit();
    }, [zoomToFitToggle]);
};
