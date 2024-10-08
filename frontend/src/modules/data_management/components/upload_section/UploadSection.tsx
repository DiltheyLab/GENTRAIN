import { CaseUpload } from "@/modules/data_management/components/upload_section/CaseUpload";
import { SampleUpload } from "@/modules/data_management/components/upload_section/SampleUpload";
import { ContactUpload } from "@/modules/data_management/components/upload_section/ContactUpload";
import { FileUploadButton } from "@/modules/core/components/ui/FileUploadButton";
import { useRef } from "react";
import { ContactsValidation } from "../../services/data_upload/validation/ContactsValidation";
import { CasesValidation } from "../../services/data_upload/validation/CasesValidation";
import { SamplesValidation } from "../../services/data_upload/validation/SamplesValidation";

export const UploadSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const resetUpload = () => {
        const inputElement: HTMLInputElement | null | undefined = containerRef.current?.querySelector(`input#cases`);
        if (inputElement) inputElement.value = "";
    };
    return (
        <>
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="flex flex-row items-end gap-3">
                    <FileUploadButton
                        type="cases"
                        validationStrategy={new CasesValidation()}
                        resetUpload={resetUpload}
                    />
                </div>
            </div>
            <CaseUpload onSubmit={resetUpload} />
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="flex flex-row items-end gap-3">
                    <FileUploadButton
                        type="samples"
                        validationStrategy={new SamplesValidation()}
                        resetUpload={resetUpload}
                    />
                </div>
            </div>
            <SampleUpload onSubmit={resetUpload} />
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="flex flex-row items-end gap-3">
                    <FileUploadButton
                        type="contacts"
                        validationStrategy={new ContactsValidation()}
                        resetUpload={resetUpload}
                    />
                </div>
            </div>
            <ContactUpload onSubmit={resetUpload} />
        </>
    );
};
