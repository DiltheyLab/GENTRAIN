import { useEffect, useRef } from "react";
import { useDataManagementStore } from "../stores/dataManagement";

export const useScrollToFastaIdElement = () => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const scrollToSample = useDataManagementStore((state) => state.scrollToSample);

    useEffect(() => {
        const fastaIdElement = document.querySelector(`[data-fasta_id=${scrollToSample}]`);
        fastaIdElement?.scrollIntoView({ behavior: "smooth" });
    }, [scrollToSample]);

    return scrollAreaRef;
};
