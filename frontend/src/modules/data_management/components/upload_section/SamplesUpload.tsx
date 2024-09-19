import { SamplesPersistence } from "@/modules/data_management/services/data_upload/persistence/SamplesPersistence";
import { SamplesValidation } from "@/modules/data_management/services/data_upload/validation/SamplesValidation";
import { FileUpload } from "@/modules/data_management/components/upload_section/FileUpload";
import { useGetFileReadingStrategy } from "@/modules/data_management/hooks/useGetFileReadingStrategy";
import { useDataManagementStore } from "../../stores/dataManagement";
import { SampleSelection } from "./SampleSelection";

export const SamplesUpload = () => {
    const sampleSelectionActive = useDataManagementStore((state) => state.sampleSelectionActive);
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
            {sampleSelectionActive && <SampleSelection />}
        </>
    );
};
