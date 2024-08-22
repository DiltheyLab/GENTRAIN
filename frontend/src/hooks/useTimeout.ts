import { useEffect } from "react";

export const useTimeout = (fn: () => void, deps: [any], delay = 1000) => {
    useEffect(() => {
        const timeout = setTimeout(fn, delay);
        return () => clearTimeout(timeout);
    }, deps);
};
