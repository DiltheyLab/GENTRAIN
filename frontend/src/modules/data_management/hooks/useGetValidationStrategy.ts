import { useCoreStore } from "@/modules/core/stores/core";
import { useEffect, useState } from "react";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { FileReadingStrategy } from "@/modules/data_management/services/data_upload/file_reading/FileReadingStrategy";

export const useGetFileReadingStrategy = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const [fileReadingStrategy, setFileReadingStrategy] = useState<FileReadingStrategy | undefined>();

    useEffect(() => {
        PathogenStrategyManager.getFileReadingStrategy().then((fileReadingStrategy) =>
            setFileReadingStrategy(fileReadingStrategy)
        );
    }, [activePathogen]);

    return fileReadingStrategy;
};
