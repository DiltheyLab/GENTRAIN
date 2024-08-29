import { CasesUpload } from "./CasesUpload";
import { SamplesUpload } from "./SamplesUpload";
import { ContactsUpload } from "./ContactsUpload";

export const UploadSection = () => {
    return (
        <>
            <CasesUpload />
            <SamplesUpload />
            <ContactsUpload />
        </>
    );
};
