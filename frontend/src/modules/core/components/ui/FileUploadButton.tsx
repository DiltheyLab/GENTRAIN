import { Label } from "./Label";
import { useTranslation } from "react-i18next";
import { GentrainException } from "../../exceptions/GentrainException";
import { formatInArray } from "../../helpers/files";
import { toast } from "./UseToast";
import { useGetFileReadingStrategy } from "@/modules/data_management/hooks/useGetFileReadingStrategy";
import { ValidationStrategy } from "@/modules/data_management/services/data_import/validation/ValidationStrategy";
import { useRef } from "react";

export type FileUploadTypes = "contacts" | "cases" | "samples" | "sampleMapping";

type FileUploadButtonProps = {
    type: FileUploadTypes;
    validationStrategy: ValidationStrategy;
    hideLabel?: boolean;
};

export const FileUploadButton = ({ type, validationStrategy, hideLabel = false }: FileUploadButtonProps) => {
    const { t } = useTranslation();
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

    const handleFileUpload = async (files: any) => {
        if (!fileReadingStrategy) {
            return;
        }
        try {
            const fileReaderResult = await fileReadingStrategy.execute(files);
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
            console.log(error);
        }
    };
    return (
        <>
            {fileReadingStrategy && (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    {!hideLabel && (
                        <Label htmlFor={type} className="font-medium">
                            {t(`upload.label.${type}`)} hinzufügen
                        </Label>
                    )}
                    <div></div>
                </div>
            )}
        </>
    );
};
