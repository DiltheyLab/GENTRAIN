import { formatTextInArray } from "@/services/files";
import { Button } from "../ui/button";
import { FileUploadButton } from "../ui/FileUploadButton";
import { useToast } from "../ui/use-toast";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export type FileUploadTypes = "contacts" | "cases" | "samples" | "sampleMapping";
export type FileReaderResult = {
    [filename: string]: string;
};

export type FileUploadComponentProps = {
    validationStrategy: (data: string[][]) => void;
    persistenceStrategy: (data: string[][]) => Promise<boolean>;
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
    const { t } = useTranslation();
    const [fileDataIsValid, setFileDataIsValid] = useState(false);
    const [fileData, setFileData] = useState<string[][]>();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            // read the file(s) and convert them to text
            const fileReaderResult = await fileReadingStrategy(e.target.files);
            // format the file content into an array
            const fileAsStringArray = formatTextInArray(fileReaderResult);
            // validate the data
            validationStrategy(fileAsStringArray);
            setFileDataIsValid(true);
            setFileData(fileAsStringArray);
        } catch (error) {
            // if an error occurs, show a toast notification with the error message
            if (error instanceof Error) {
                toast({
                    title: t(`error:upload.title`),
                    description: t(`error:upload.${error.message}`),
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
            // show a success toast notification
            toast({
                title: "Datei wurde erfolgreich hochgeladen",
                duration: 5000,
                variant: "default",
            });
        } catch (error) {
            toast({
                title: t(`error:upload.title`),
                duration: 10000,
                variant: "destructive",
            });
            console.log(error);
        }
    };

    return (
        <div className="flex flex-row items-end gap-3">
            <FileUploadButton type={type} accept=".csv" multiple={allowMultiFile} onUpload={handleFileUpload} />
            <Button onClick={handleSubmit} disabled={!fileDataIsValid}>
                Hochladen
            </Button>
        </div>
    );
};
