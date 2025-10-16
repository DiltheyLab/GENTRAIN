import { useCoreStore } from "@/modules/core/stores/core";
import { useEffect, useState } from "react";

export const useEnableExampleDataDownload = (type: string | null) => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const [enableExampleDataDownload, setEnableExampleDataDownload] = useState(false);

    useEffect(() => {
        if (!activePathogen) {
            setEnableExampleDataDownload(false);
            return;
        }
        fetch(`${import.meta.env.VITE_API_HOST}/pathogens/${activePathogen?.id}/example_data/${type}`)
            .then((response) => {
                if (response.ok) {
                    setEnableExampleDataDownload(true);
                } else {
                    setEnableExampleDataDownload(false);
                }
            })
            .catch(() => {
                setEnableExampleDataDownload(false);
            });
    }, [activePathogen]);

    return enableExampleDataDownload;
};
