import { Label } from "./label";
import { Input } from "./input";
import { FileUploadTypes } from "../dataUpload/DataUploadFactory";

type FileUploadButtonProps = {
    type: FileUploadTypes;
    accept: string;
    multiple: boolean;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const FileUploadButton = ({ type, accept, multiple, onUpload }: FileUploadButtonProps) => {
    const textVariants: Record<FileUploadTypes, string> = {
        contacts: "Kontaktdatei hochladen",
        cases: "Falldatei hochladen",
        samples: "Sequenzdatei hochladen",
        sampleMapping: "Sequenz-Fall-Datei hochladen",
    };
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor={type}>{textVariants[type]}</Label>
            <Input id={type} type="file" accept={accept} multiple={multiple} onChange={(e) => onUpload(e)} />
        </div>
    );
};
