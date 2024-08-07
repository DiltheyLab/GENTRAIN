import { fileReadingStrategies } from "@/strategies/fileUpload/fileReading";
import { FileUploadFactory } from "./DataUploadFactory";
import { validationStrategies } from "@/strategies/fileUpload/validation";
import { persistenceStrategies } from "@/strategies/fileUpload/persistence";
import { useAppStore } from "@/stores/app";
import { useGetPathogenTypeByName } from "@/hooks/database/pathogen_types/useGetAllPathogenTypes";
import { PathogenStrategyManager } from "@/strategies/PathogenStrategyManager";
import { PathogenTypeName } from "@/database/pathogen_types";
import { Button } from "../ui/button";

export const UploadSection = () => {
    const activePathogen = useAppStore((state) => state.activePathogen);
    const bacteriaPathogenType = useGetPathogenTypeByName("bacteria");
    const allowMultiFile = activePathogen?.pathogen_type_id === bacteriaPathogenType?.id ? true : false;

    const recalculate = async () => {
        const distanceCalculationStrategy = PathogenStrategyManager.getDistanceCalculationStrategy(
            PathogenTypeName.virus.toString()
        );
        await distanceCalculationStrategy.execute();
    };
    return (
        <>
            <FileUploadFactory
                type="cases"
                allowMultiFile={false}
                fileReadingStrategy={fileReadingStrategies.singleFile}
                validationStrategy={validationStrategies.casesStrategy}
                persistenceStrategy={persistenceStrategies.casesStrategy}
            />
            <FileUploadFactory
                type="samples"
                allowMultiFile={allowMultiFile}
                fileReadingStrategy={
                    allowMultiFile ? fileReadingStrategies.multiFile : fileReadingStrategies.singleFile
                }
                validationStrategy={validationStrategies.sampleStrategy}
                persistenceStrategy={persistenceStrategies.sampleStrategy}
            />
            <Button onClick={recalculate}>Recalculate</Button>
            <FileUploadFactory
                type="contacts"
                allowMultiFile={false}
                fileReadingStrategy={fileReadingStrategies.singleFile}
                validationStrategy={validationStrategies.contactsStrategy}
                persistenceStrategy={persistenceStrategies.contactsStrategy}
            />
        </>
    );
};
