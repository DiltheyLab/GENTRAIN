import { FileUploadButton } from "@/modules/core/components/ui/FileUploadButton";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { formatInArray } from "@/modules/core/helpers/files";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { FileReadingStrategy } from "@/modules/data_management/services/data_upload/file_reading/FileReadingStrategy";
import { PersistenceStrategy } from "@/modules/data_management/services/data_upload/persistence/PersistenceStrategy";
import { ValidationStrategy } from "@/modules/data_management/services/data_upload/validation/ValidationStrategy";
import { Dialog, DialogContent, DialogFooter } from "@/modules/core/components/ui/Dialog";
import { CaseSelection } from "./CaseSelection";
import { useDataManagementStore } from "../../stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { SampleSelection } from "./SampleSelection";
import { ContactSelection } from "./ContactSelection";
import { CaseUpdate } from "./CaseUpdate";

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
    const setSampleSelectionActive = useDataManagementStore((state) => state.setSampleSelectionActive);
    const setCaseSelectionActive = useDataManagementStore((state) => state.setCaseSelectionActive);
    const setContactSelectionActive = useDataManagementStore((state) => state.setContactSelectionActive);
    const contactSelectionActive = useDataManagementStore((state) => state.contactSelectionActive);
    const sampleSelectionActive = useDataManagementStore((state) => state.sampleSelectionActive);
    const caseSelectionActive = useDataManagementStore((state) => state.caseSelectionActive);
    const containerRef = useRef<HTMLDivElement>(null);
    const [updateState, setUpdateState] = useState(true);

    const resetUpload = () => {
        // refresh file input
        const inputElement: HTMLInputElement | null | undefined = containerRef.current?.querySelector(`input#${type}`);
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
            if (validationResult.data.length === 0) {
                resetUpload();
                return;
            }
            e.target.value = "";
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

    const handleUpdate = async () => {
        try {
            setUpdateState(false);
            await persistenceStrategy.executeUpdate();
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

    const handleSubmit = async () => {
        try {
            await persistenceStrategy.executePersist();
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
                </div>
            </div>
            {i18n.exists(`upload.help.${type}`) && (
                <small
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: t(`upload.help.${type}`) }}
                ></small>
            )}
            {type === "cases" && (
                <Dialog
                    onOpenChange={(value) => {
                        setCaseSelectionActive(value);
                    }}
                    open={caseSelectionActive}
                >
                    <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                        {caseSelectionActive && !updateState && (
                            <>
                                <CaseSelection />
                                <DialogFooter>
                                    <Button onClick={() => handleSubmit()}>Fälle hinzufügen</Button>
                                </DialogFooter>
                            </>
                        )}
                        {caseSelectionActive && updateState && (
                            <>
                                <CaseUpdate />
                                <DialogFooter>
                                    <Button onClick={() => handleUpdate()}>Fälle aktualisieren</Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            )}
            {type === "samples" && (
                <Dialog
                    onOpenChange={(value) => {
                        setSampleSelectionActive(value);
                    }}
                    open={sampleSelectionActive}
                >
                    <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                        {sampleSelectionActive && <SampleSelection />}
                        <DialogFooter>
                            <Button onClick={handleSubmit}>Sequenzen hinzufügen</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            {type === "contacts" && (
                <Dialog
                    onOpenChange={(value) => {
                        setContactSelectionActive(value);
                    }}
                    open={contactSelectionActive}
                >
                    <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                        {contactSelectionActive && <ContactSelection />}
                        <DialogFooter>
                            <Button onClick={handleSubmit}>Kontakte hinzufügen</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};
