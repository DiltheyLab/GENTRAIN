import { FileUploadButton } from "@/modules/core/components/ui/FileUploadButton";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { formatInArray } from "@/modules/core/helpers/files";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { FileReadingStrategy } from "@/modules/data_management/services/data_upload/file_reading/FileReadingStrategy";
import { PersistenceStrategy } from "@/modules/data_management/services/data_upload/persistence/PersistenceStrategy";
import { ValidationStrategy } from "@/modules/data_management/services/data_upload/validation/ValidationStrategy";
import { Button } from "@/modules/core/components/ui/Button";

export type FileUploadTypes = "contacts" | "cases" | "samples" | "sampleMapping";

export type FileUploadComponentProps = {
    validationStrategy: ValidationStrategy;
    persistenceStrategy: PersistenceStrategy;
    fileReadingStrategy: FileReadingStrategy;
    type: FileUploadTypes;
};

export const FileUpload = ({
    validationStrategy,
    persistenceStrategy,
    fileReadingStrategy,
    type,
}: FileUploadComponentProps) => {
    const { toast } = useToast();
    const { t, i18n } = useTranslation();
    const [fileDataIsValid, setFileDataIsValid] = useState(false);
    const [fileData, setFileData] = useState<
        Array<Array<string>> | { fastaId: string; sequence: string }[] | string[][]
    >();
    const containerRef = useRef<HTMLDivElement>(null);

    const resetUpload = () => {
        // refresh file input
        const inputElement: HTMLInputElement | null | undefined = containerRef.current?.querySelector(`input#${type}`);
        if (inputElement) inputElement.value = "";
        // reset upload button
        setFileDataIsValid(false);
    };

    const showWarningToasts = (warnings: { title: string; description: string }[]) => {
        for (const warning of warnings) {
            toast({
                title: warning.title,
                description: warning.description,
                duration: 30000,
                variant: "default",
            });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setFileDataIsValid(true);
            if (validationResult.data.length === 0) {
                resetUpload();
                return;
            }
            setFileData(validationResult.data);
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

    const handleSubmit = async () => {
        if (!fileDataIsValid || !fileData) return;
        try {
            // persist the data
            await persistenceStrategy.execute(fileData);
            resetUpload();
        } catch (error) {
            if (error instanceof GentrainException || error instanceof ZodError || error instanceof Error) {
                toast({
                    title: t(`error:upload.title`),
                    description: getToastDescription(error),
                    duration: 10000,
                    variant: "destructive",
                });
                console.log(error, error.message);
                return;
            }
            console.log(error);
        }
    };

    return (
        <>
            <div ref={containerRef} className="flex flex-col gap-3">
                <div className="flex flex-row items-end gap-3">
                    <FileUploadButton
                        type={type}
                        accept={type === "samples" ? ".fasta" : ".csv"}
                        multiple={fileReadingStrategy.allowMultifile()}
                        onUpload={handleFileUpload}
                    />
                    <Button onClick={handleSubmit} disabled={!fileDataIsValid}>
                        Bestätigen
                    </Button>
                </div>
            </div>
            {i18n.exists(`upload.help.${type}`) && (
                <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t(`upload.help.${type}`) }}></p>
            )}
        </>
    );
};
