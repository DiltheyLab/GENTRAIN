import { useEffect, useRef } from "react";
import { CaseWithRelationships } from "../../models/cases";

export const useCanvasClick = (updateSelectedCase: (selectedCase: CaseWithRelationships | null) => void) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // set selectedCase to null to hide infobox by click on canvas
    useEffect(() => {
        canvasRef.current = document.querySelector("canvas");
        const handleCanvasClick = () => {
            updateSelectedCase(null);
        };
        canvasRef.current?.addEventListener("click", handleCanvasClick);

        return () => canvasRef.current?.removeEventListener("click", handleCanvasClick);
    }, [updateSelectedCase]);
};
