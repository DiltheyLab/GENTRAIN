import { FileUploadButton } from "@/modules/core/components/ui/FileUploadButton";
import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { formatInArray } from "@/modules/core/helpers/files";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Dialog, DialogContent, DialogFooter } from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "../../stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { SingleFileReading } from "../../services/data_upload/file_reading/SingleFileReading";
import { useGetContactUploads } from "../../hooks/useGetContactUploads";
import { ContactSelection } from "./ContactSelection";
import { ContactsValidation } from "../../services/data_upload/validation/ContactsValidation";
import { ContactsPersistence } from "../../services/data_upload/persistence/ContactsPersistence";

export type FileUploadTypes = "contacts" | "cases" | "samples" | "sampleMapping";

export const ContactsUpload = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const contactUploads = useGetContactUploads();
    const setContactSelectionActive = useDataManagementStore((state) => state.setContactSelectionActive);
    const contactSelectionActive = useDataManagementStore((state) => state.contactSelectionActive);
    const containerRef = useRef<HTMLDivElement>(null);

    const resetUpload = () => {
        const inputElement: HTMLInputElement | null | undefined = containerRef.current?.querySelector(`input#cases`);
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
        const fileReadingStrategy = new SingleFileReading();
        const validationStrategy = new ContactsValidation();
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

    const handleSubmit = async () => {
        const persistenceStrategy = new ContactsPersistence();
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
                    <FileUploadButton type="contacts" accept=".csv" multiple={false} onUpload={handleFileUpload} />
                </div>
            </div>
            <small
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: t(`upload.help.cases`) }}
            ></small>
            {contactUploads && (
                <Dialog
                    onOpenChange={(open) => {
                        setContactSelectionActive(open);
                        if (!open) {
                            useDataManagementStore.getState().clearCaseUploads();
                            useDataManagementStore.getState().clearExistingCases();
                        }
                    }}
                    open={contactSelectionActive}
                >
                    <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                        {contactSelectionActive && (
                            <>
                                <ContactSelection />
                                <DialogFooter>
                                    <Button onClick={handleSubmit}>Kontakte hinzufügen</Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};
