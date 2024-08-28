import { fileReadingStrategies } from "@/strategies/fileUpload/fileReading";
import { FileUploadFactory } from "./DataUploadFactory";
import { validationStrategies } from "@/strategies/fileUpload/validation";
import { persistenceStrategies } from "@/strategies/fileUpload/persistence";
import { useAppStore } from "@/stores/app";
import { useGetPathogenTypeByName } from "@/modules/core/hooks/database/pathogen_types/useGetAllPathogenTypes";

export const UploadSection = () => {
    const activePathogen = useAppStore((state) => state.activePathogen);
    const bacteriaPathogenType = useGetPathogenTypeByName("bacteria");
    const allowMultiFile = activePathogen?.pathogen_type_id === bacteriaPathogenType?.id ? true : false;

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
