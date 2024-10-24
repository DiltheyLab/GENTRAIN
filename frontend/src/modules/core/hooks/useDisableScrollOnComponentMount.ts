import { useEffect } from "react";

export const useDisableScollOnComponentMount = (deps: [any]) => {
    useEffect(() => {
        const disableScroll = () => {
            document.body.style.overflow = "hidden";
        };

        const enableScroll = () => {
            document.body.style.overflow = "auto";
        };

        disableScroll();

        // Activate scrolling when component unmounts
        return () => {
            enableScroll();
        };
    }, deps);
};
