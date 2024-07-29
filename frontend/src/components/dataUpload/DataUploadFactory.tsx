import { formatTextInArray } from "@/services/files";
import { Button } from "../ui/button";
import { FileUploadButton } from "../ui/FileUploadButton";
import { useToast } from "../ui/use-toast";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { GentrainException } from "@/exceptions/GentrainException";
import { ZodError } from "zod";
import { getToastDescription } from "@/services/errors";
import { SampleUploadStatus } from "./SampleUploadStatus";
import { useSampleUploadStore } from "@/stores/upload";

export type FileUploadTypes = "contacts" | "cases" | "samples" | "sampleMapping";
export type FileReaderResult = {
    [filename: string]: string;
    mimetype: string;
};

export type FileUploadComponentProps = {
    validationStrategy: (
        data: any
    ) =>
        | Promise<{ data: any; warnings: { title: string; description: string }[] }>
        | { data: any; warnings: { title: string; description: string }[] };
    persistenceStrategy: (data: any) => Promise<void> | void;
    fileReadingStrategy: (files: FileList | null) => Promise<FileReaderResult> | Promise<FileReaderResult[]>;
    type: FileUploadTypes;
    allowMultiFile: boolean;
};

export const FileUploadFactory = ({
    validationStrategy,
    persistenceStrategy,
    fileReadingStrategy,
    type,
    allowMultiFile,
}: FileUploadComponentProps) => {
    const { toast } = useToast();
    const { t, i18n } = useTranslation();
    const [fileDataIsValid, setFileDataIsValid] = useState(false);
    const [fileData, setFileData] = useState<string[][] | object[]>();
    const containerRef = useRef<HTMLDivElement>(null);

    const { reset } = useSampleUploadStore();
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
            // reset sample status component data
            reset();

            // read the file(s) and convert them to text
            const fileReaderResult = await fileReadingStrategy(e.target.files);

            // format the file content into an array
            const fileAsStringArray = formatTextInArray(fileReaderResult);
            // validate the data
            const validationResult = await validationStrategy(fileAsStringArray);
            showWarningToasts(validationResult.warnings);
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
            await persistenceStrategy(fileData);
            resetUpload();
            // show a success toast notification
            toast({
                title: "Datei wurde erfolgreich hochgeladen",
                duration: 5000,
                variant: "success",
            });
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
                        multiple={allowMultiFile}
                        onUpload={handleFileUpload}
                    />
                    <Button onClick={handleSubmit} disabled={!fileDataIsValid}>
                        Hochladen
                    </Button>
                </div>
                {type === "samples" && (
                    <div>
                        <SampleUploadStatus />
                    </div>
                )}
            </div>
            {i18n.exists(`upload.help.${type}`) && (
                <small
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: t(`upload.help.${type}`) }}
                ></small>
            )}
        </>
    );
};
