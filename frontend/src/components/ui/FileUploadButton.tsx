import { Label } from "./label";
import { Input } from "./input";
import { FileUploadTypes } from "../dataUpload/DataUploadFactory";
import { useTranslation } from "react-i18next";

type FileUploadButtonProps = {
    type: FileUploadTypes;
    accept: string;
    multiple: boolean;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const FileUploadButton = ({ type, accept, multiple, onUpload }: FileUploadButtonProps) => {
    const { t } = useTranslation();

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={type}>{t(`upload.label.${type}`)}</Label>
            <small
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: t(`upload.info.${type}`) }}
            ></small>
            <Input id={type} type="file" accept={accept} multiple={multiple} onChange={(e) => onUpload(e)} />
        </div>
    );
};
