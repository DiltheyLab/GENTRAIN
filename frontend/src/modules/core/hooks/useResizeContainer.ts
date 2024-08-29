import { useEffect, useState } from "react";

export const useResizeContainer = (container: HTMLDivElement | null) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const adjustWidthAndHeight = () => {
        setWidth(container?.offsetWidth ?? 0);
        setHeight(container?.offsetHeight ?? 0);
    };

    useEffect(() => {
        if (!container) return;
        adjustWidthAndHeight();
        window.addEventListener("resize", adjustWidthAndHeight);
        return () => {
            window.removeEventListener("resize", adjustWidthAndHeight);
        };
    }, [container]);

    return [width, height];
};
