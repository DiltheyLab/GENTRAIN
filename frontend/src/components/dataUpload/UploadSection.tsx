import { fileReadingStrategies } from "@/strategies/fileUpload/fileReading";
import { FileUploadFactory } from "./DataUploadFactory";
import { validationStrategies } from "@/strategies/fileUpload/validation";
import { persistenceStrategies } from "@/strategies/fileUpload/persistance";

export const UploadSection = () => {
    // Wenn wir bakterielle Pathogene bearbeiten muss multiFile verwendet werden
    // const allowMultiFile = activePathogentype === "bacteria";
    const allowMultiFile = false;

    return (
        <>
            <FileUploadFactory
                type="cases"
                allowMultiFile={false}
                fileReadingStrategy={fileReadingStrategies.singleFile}
                validationStrategy={validationStrategies.contactsStrategy}
                persistenceStrategy={persistenceStrategies.contactsStrategy}
            />
            <FileUploadFactory
                type="samples"
                allowMultiFile={allowMultiFile}
                fileReadingStrategy={
                    allowMultiFile ? fileReadingStrategies.multiFile : fileReadingStrategies.singleFile
                }
                validationStrategy={validationStrategies.contactsStrategy}
                persistenceStrategy={persistenceStrategies.contactsStrategy}
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
