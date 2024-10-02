import { useEffect, useRef } from "react";

export const useCanvasClick = (callbacks: Array<() => void>) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        canvasRef.current = document.querySelector("canvas");
        const handleCanvasClick = () => {
            callbacks.forEach((callback) => callback());
        };
        canvasRef.current?.addEventListener("click", handleCanvasClick);

        return () => canvasRef.current?.removeEventListener("click", handleCanvasClick);
    }, [callbacks]);
};
