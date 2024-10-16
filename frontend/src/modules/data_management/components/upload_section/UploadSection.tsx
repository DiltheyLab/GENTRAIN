import { CaseUpload } from "@/modules/data_management/components/upload_section/CaseUpload";
import { SampleUpload } from "@/modules/data_management/components/upload_section/SampleUpload";
import { ContactUpload } from "@/modules/data_management/components/upload_section/ContactUpload";

export const UploadSection = () => {
    return (
        <div className="flex gap-8">
            <div className="w-1/3">
                <CaseUpload />
            </div>
            <div className="w-1/3">
                <SampleUpload />
            </div>
            <div className="w-1/3">
                <ContactUpload />
            </div>
        </div>
    );
};
