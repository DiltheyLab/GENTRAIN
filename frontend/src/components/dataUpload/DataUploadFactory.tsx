import { formatTextInArray } from "@/services/files";
import { Button } from "../ui/button";
import { FileUploadButton } from "../ui/FileUploadButton";
import { useToast } from "../ui/use-toast";
import { useTranslation } from "react-i18next";

export type FileUploadTypes = "contacts" | "cases" | "samples" | "sampleMapping";
export type FileReaderResult = {
    [filename: string]: string;
};

export type FileUploadComponentProps = {
    validationStrategy: (data: string[][]) => void; //ToDo: define the type of data
    persistenceStrategy: (data: any) => void; //ToDo: define the type of data
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const fileReaderResult = await fileReadingStrategy(e.target.files);
            const fileAsStringArray = formatTextInArray(fileReaderResult);
            validationStrategy(fileAsStringArray);
            persistenceStrategy(fileAsStringArray.slice(1, fileAsStringArray.length));
        } catch (error) {
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
            console.log(error);
        }
    };

    return (
        <div className="flex flex-row items-end gap-3">
            <FileUploadButton type={type} accept=".csv" multiple={allowMultiFile} onUpload={handleFileUpload} />
            <Button>Hochladen</Button>
        </div>
    );
};
