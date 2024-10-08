import { CasesUpload } from "./CasesUpload";
import { SamplesUpload } from "./SamplesUpload";
import { ContactsUpload } from "./ContactsUpload";
import { useGetFileReadingStrategy } from "../../hooks/useGetFileReadingStrategy";
import { toast } from "@/modules/core/components/ui/UseToast";
import { FileUploadButton } from "@/modules/core/components/ui/FileUploadButton";
import { useRef } from "react";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { t } from "i18next";
import { formatInArray } from "@/modules/core/helpers/files";
import { ValidationStrategy } from "../../services/data_upload/validation/ValidationStrategy";
import { ContactsValidation } from "../../services/data_upload/validation/ContactsValidation";
import { SamplesValidation } from "../../services/data_upload/validation/SamplesValidation";
import { CasesValidation } from "../../services/data_upload/validation/CasesValidation";

export const UploadSection = () => {
    const fileReadingStrategy = useGetFileReadingStrategy();

    const containerRef = useRef<HTMLDivElement>(null);
    const resetUpload = () => {
        const inputElement: HTMLInputElement | null | undefined = containerRef.current?.querySelector(`input#cases`);
        if (inputElement) inputElement.value = "";
    };

    const showWarningToasts = (warnings: { title: string; description: string }[]) => {
        for (const warning of warnings) {
            toast({
                title: warning.title,
                description: warning.description,
                duration: 10000,
                variant: "default",
            });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, validationStrategy: ValidationStrategy) => {
        if (!fileReadingStrategy) {
            return;
        }
        try {
            const fileReaderResult = await fileReadingStrategy.execute(e.target.files);
            if (!fileReaderResult) return;
            // format the file content into an array
            const fileAsStringArray = formatInArray(fileReaderResult);

            // validate the data
            const validationResult = await validationStrategy.execute(fileAsStringArray);
            if (validationResult.warnings) {
                showWarningToasts(validationResult.warnings);
            }
            if (validationResult.data.length === 0) {
                resetUpload();
                return;
            }
            e.target.value = "";
        } catch (error) {
            // if an error occurs, show a toast notification with the error message
            if (error instanceof GentrainException) {
                toast({
                    title: t(`error:upload.title`),
                    description: error.data
                        ? t(`error:upload.${error.message}`, { data: error.data.join(", ") })
                        : t(`error:upload.${error.message}`),
                    duration: 10000,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: t(`error:upload.title`),
                    duration: 10000,
                    variant: "destructive",
                });
            }
            // reset the input field to allow the user to try again with the same file
            e.target.value = "";
            console.log(error);
        }
    };

    return (
        <>
            {fileReadingStrategy && (
                <>
                    <div ref={containerRef} className="flex flex-col gap-3">
                        <div className="flex flex-row items-end gap-3">
                            <FileUploadButton
                                type="cases"
                                fileReadingStrategy={fileReadingStrategy}
                                onUpload={(evt) => handleFileUpload(evt, new CasesValidation())}
                            />
                        </div>
                    </div>
                    <CasesUpload onSubmit={resetUpload} />
                    <div ref={containerRef} className="flex flex-col gap-3">
                        <div className="flex flex-row items-end gap-3">
                            <FileUploadButton
                                type="samples"
                                fileReadingStrategy={fileReadingStrategy}
                                onUpload={(evt) => handleFileUpload(evt, new SamplesValidation())}
                            />
                        </div>
                    </div>
                    <SamplesUpload onSubmit={resetUpload} />
                    <div ref={containerRef} className="flex flex-col gap-3">
                        <div className="flex flex-row items-end gap-3">
                            <FileUploadButton
                                type="contacts"
                                fileReadingStrategy={fileReadingStrategy}
                                onUpload={(evt) => handleFileUpload(evt, new ContactsValidation())}
                            />
                        </div>
                    </div>
                    <ContactsUpload onSubmit={resetUpload} />
                </>
            )}
        </>
    );
};
