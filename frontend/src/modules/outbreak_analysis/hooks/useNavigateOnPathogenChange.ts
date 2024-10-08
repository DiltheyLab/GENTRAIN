import { useCoreStore } from "@/modules/core/stores/core";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useNavigateOnPathogenChange = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const navigate = useNavigate();
    const prevActivePathogenRef = useRef(activePathogen);

    useEffect(() => {
        // If the active pathogen changes, navigate to the outbreak analysis page
        if (prevActivePathogenRef.current && prevActivePathogenRef.current.id !== activePathogen?.id) {
            navigate("/outbreak-analysis");
        }
        prevActivePathogenRef.current = activePathogen;
    }, [activePathogen]);
};
