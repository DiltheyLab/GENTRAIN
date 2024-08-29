import { FileUpload } from "./FileUpload";
import { SingleFileReading } from "@/modules/data_management/services/data_upload/file_reading/SingleFileReading";
import { ContactsValidation } from "@/modules/data_management/services/data_upload/validation/ContactsValidation";
import { ContactsPersistence } from "@/modules/data_management/services/data_upload/persistence/ContactsPersistence";

export const ContactsUpload = () => {
    return (
        <>
            <FileUpload
                type="contacts"
                fileReadingStrategy={new SingleFileReading()}
                validationStrategy={new ContactsValidation()}
                persistenceStrategy={new ContactsPersistence()}
            />
        </>
    );
};
