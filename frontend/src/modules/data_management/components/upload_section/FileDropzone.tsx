import { useDropzone } from "react-dropzone";
import { CirclePlus, Upload } from "lucide-react";
import { formatInArray } from "@/modules/core/helpers/files";
import { toast } from "@/modules/core/components/ui/UseToast";
import { useTranslation } from "react-i18next";
import { useGetFileReadingStrategy } from "../../hooks/useGetFileReadingStrategy";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { ValidationStrategy } from "../../services/data_upload/validation/ValidationStrategy";

export const FileDropzone = ({
    label,
    type,
    validationStrategy,
    icon = <Upload width={50} height={50} />,
}: {
    label: string;
    type: string;
    validationStrategy: ValidationStrategy;
    icon?: JSX.Element;
}) => {
    const { t } = useTranslation();
    const fileReadingStrategy = useGetFileReadingStrategy(type);

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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileUpload });

    return (
        <>
            {fileReadingStrategy && (
                <div
                    {...getRootProps()}
                    className={`flex flex-col p-10 items-center border-2 rounded-lg border-dashed border-muted-foreground/10 hover:border-muted-foreground/30 bg-muted/50 min-w-[100px] w-full group cursor-pointer ${
                        isDragActive ? "border-muted-foreground/30" : ""
                    }`}
                >
                    <input
                        {...getInputProps()}
                        accept={fileReadingStrategy.getAcceptedMimeType(type)}
                        multiple={fileReadingStrategy.allowMultifile()}
                        onChange={(e) => {
                            handleFileUpload(e.target.files);
                        }}
                    />
                    <h3 className="font-bold tracking-tight text-lg mb-4">{label}</h3>
                    <div className="relative">
                        <CirclePlus
                            className={`absolute -bottom-2 -right-2 fill-black w-[30px] h-[30px] group-hover:scale-125 transition-all ease-in-out group-hover:fill-primary text-white ${
                                isDragActive ? "fill-primary scale-125" : " fill-black"
                            }`}
                            fill="black"
                        />
                        {icon && <div>{icon}</div>}
                    </div>

                    <div className="text-center mt-4 flex items-center justfy-center flex-1 lg:px-10">
                        {isDragActive ? (
                            <small>
                                Platzieren Sie die Dateien in der Fläche.
                                <br />
                                <br />
                            </small>
                        ) : (
                            <small>
                                Ziehen Sie {fileReadingStrategy.allowMultifile() ? "Dateien" : "eine Datei"} in die
                                Fläche oder klicken Sie auf die Fläche um {label} zu auszuwählen.
                            </small>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
