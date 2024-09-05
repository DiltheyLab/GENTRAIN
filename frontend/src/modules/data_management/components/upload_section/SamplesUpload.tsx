import { SamplesPersistence } from "@/modules/data_management/services/data_upload/persistence/SamplesPersistence";
import { SamplesValidation } from "@/modules/data_management/services/data_upload/validation/SamplesValidation";
import { FileUpload } from "@/modules/data_management/components/upload_section/FileUpload";
import { useGetFileReadingStrategy } from "@/modules/data_management/hooks/useGetFileReadingStrategy";

export const SamplesUpload = () => {
    const fileReadingStrategy = useGetFileReadingStrategy();
    if (!fileReadingStrategy) return;
    return (
        <>
            <FileUpload
                type="samples"
                fileReadingStrategy={fileReadingStrategy}
                validationStrategy={new SamplesValidation()}
                persistenceStrategy={new SamplesPersistence()}
            />
        </>
    );
};
