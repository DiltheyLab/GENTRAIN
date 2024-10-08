import { useEffect, useState } from "react";

export const useResizeContainer = (container: HTMLDivElement | null) => {
    const [width, setWidth] = useState(container?.offsetWidth ?? 0);
    const [height, setHeight] = useState(container?.offsetHeight ?? 0);

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
    }, [container, container?.offsetHeight]);

    return [width, height];
};
