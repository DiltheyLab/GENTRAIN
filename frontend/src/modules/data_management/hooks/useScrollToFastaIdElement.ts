import { useEffect, useRef } from "react";
import { useDataManagementStore } from "../stores/dataManagement";

export const useScrollToFastaIdElement = () => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const scrollToSequence = useDataManagementStore((state) => state.scrollToSequence);

    useEffect(() => {
        const fastaIdElement = document.querySelector(`[data-fasta_id="${scrollToSequence}"]`);
        fastaIdElement?.scrollIntoView({ behavior: "smooth" });
    }, [scrollToSequence]);

    return scrollAreaRef;
};
