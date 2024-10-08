import { Label } from "./Label";
import { Input } from "./Input";
import { useTranslation } from "react-i18next";
import { GentrainException } from "../../exceptions/GentrainException";
import { formatInArray } from "../../helpers/files";
import { toast } from "./UseToast";
import { useGetFileReadingStrategy } from "@/modules/data_management/hooks/useGetFileReadingStrategy";
import { ValidationStrategy } from "@/modules/data_management/services/data_upload/validation/ValidationStrategy";
import { useRef } from "react";

export type FileUploadTypes = "contacts" | "cases" | "samples" | "sampleMapping";

type FileUploadButtonProps = {
    type: FileUploadTypes;
    validationStrategy: ValidationStrategy;
};

export const FileUploadButton = ({ type, validationStrategy }: FileUploadButtonProps) => {
    const { t, i18n } = useTranslation();
    const fileReadingStrategy = useGetFileReadingStrategy(type);

    const inputRef = useRef<HTMLInputElement>(null);

    const resetUpload = () => {
        const inputElement: HTMLInputElement | null | undefined = inputRef.current;
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={type} className="font-medium">
                        {t(`upload.label.${type}`)}
                    </Label>
                    {i18n.exists(`upload.info.${type}`) && (
                        <small
                            className="text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: t(`upload.info.${type}`) }}
                        ></small>
                    )}
                    <div>
                        <Input
                            ref={inputRef}
                            id={type}
                            type="file"
                            accept={fileReadingStrategy.getAcceptedMimeType(type)}
                            multiple={fileReadingStrategy.allowMultifile()}
                            onChange={(e) => handleFileUpload(e)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
