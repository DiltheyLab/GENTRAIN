import { Label } from "./Label";
import { Input } from "./Input";
import { useTranslation } from "react-i18next";
import { FileUploadTypes } from "@/data_management/components/upload_section/DataUploadFactory";

type FileUploadButtonProps = {
    type: FileUploadTypes;
    accept: string;
    multiple: boolean;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const FileUploadButton = ({ type, accept, multiple, onUpload }: FileUploadButtonProps) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={type}>{t(`upload.label.${type}`)}</Label>
            {i18n.exists(`upload.info.${type}`) && (
                <small
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: t(`upload.info.${type}`) }}
                ></small>
            )}
            <Input id={type} type="file" accept={accept} multiple={multiple} onChange={(e) => onUpload(e)} />
        </div>
    );
};
