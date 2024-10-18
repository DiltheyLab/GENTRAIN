import { useEffect, useState } from "react";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { FileReadingStrategy } from "@/modules/data_management/services/data_import/file_reading/FileReadingStrategy";

export const useGetFileReadingStrategy = (type: string) => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const [fileReadingStrategy, setFileReadingStrategy] = useState<FileReadingStrategy | undefined>();

    useEffect(() => {
        PathogenStrategyManager.getFileReadingStrategy(type).then((fileReadingStrategy) =>
            setFileReadingStrategy(fileReadingStrategy)
        );
    }, [activePathogen]);

    return fileReadingStrategy;
};
