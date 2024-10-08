import { Label } from "./Label";
import { Input } from "./Input";
import { useTranslation } from "react-i18next";
import { FileReadingStrategy } from "@/modules/data_management/services/data_upload/file_reading/FileReadingStrategy";

export type FileUploadTypes = "contacts" | "cases" | "samples" | "sampleMapping";

type FileUploadButtonProps = {
    type: FileUploadTypes;
    fileReadingStrategy: FileReadingStrategy;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FileUploadButton = ({ type, fileReadingStrategy, onUpload }: FileUploadButtonProps) => {
    const { t, i18n } = useTranslation();

    return (
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
                    id={type}
                    type="file"
                    accept={fileReadingStrategy.getAcceptedMimeType(type)}
                    multiple={fileReadingStrategy.allowMultifile()}
                    onChange={(e) => onUpload(e)}
                />
            </div>
        </div>
    );
};
