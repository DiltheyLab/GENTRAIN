import { CaseUpload } from "@/modules/data_management/components/upload_section/CaseUpload";
import { SampleUpload } from "@/modules/data_management/components/upload_section/SampleUpload";
import { ContactUpload } from "@/modules/data_management/components/upload_section/ContactUpload";
import { FileUploadButton } from "@/modules/core/components/ui/FileUploadButton";
import { ContactsValidation } from "../../services/data_upload/validation/ContactsValidation";
import { CasesValidation } from "../../services/data_upload/validation/CasesValidation";
import { SamplesValidation } from "../../services/data_upload/validation/SamplesValidation";
import { useCoreStore } from "@/modules/core/stores/core";

export const UploadSection = () => {
    const cases = useCoreStore((state) => state.casesWithRelationships);
    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex flex-row items-end gap-3">
                    <FileUploadButton type="cases" validationStrategy={new CasesValidation()} />
                </div>
            </div>
            <CaseUpload />
            <div
                className={`flex flex-col gap-3 ${
                    cases.length === 0 ? "pointer-events-none opacity-50" : "opacity-100"
                }`}
            >
                <div className="flex flex-row items-end gap-3">
                    <FileUploadButton type="samples" validationStrategy={new SamplesValidation()} />
                </div>
            </div>
            <SampleUpload />
            <div
                className={`flex flex-col gap-3 ${
                    cases.length === 0 ? "pointer-events-none opacity-50" : "opacity-100"
                }`}
            >
                <div className="flex flex-row items-end gap-3">
                    <FileUploadButton type="contacts" validationStrategy={new ContactsValidation()} />
                </div>
            </div>
            <ContactUpload />
        </>
    );
};
