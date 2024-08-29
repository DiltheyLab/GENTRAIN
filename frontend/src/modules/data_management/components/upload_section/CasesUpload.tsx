import { FileUpload } from "./FileUpload";
import { CasesPersistence } from "@/modules/data_management/services/data_upload/persistence/CasesPersistence";
import { CasesValidation } from "@/modules/data_management/services/data_upload/validation/CasesValidation";
import { SingleFileReading } from "@/modules/data_management/services/data_upload/file_reading/SingleFileReading";

export const CasesUpload = () => {
    return (
        <>
            <FileUpload
                type="cases"
                fileReadingStrategy={new SingleFileReading()}
                validationStrategy={new CasesValidation()}
                persistenceStrategy={new CasesPersistence()}
            />
        </>
    );
};
