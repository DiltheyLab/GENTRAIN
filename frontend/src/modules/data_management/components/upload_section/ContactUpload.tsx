import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Dialog, DialogContent, DialogFooter } from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { ContactsPersistence } from "@/modules/data_management/services/data_upload/persistence/ContactsPersistence";
import { ContactSelection } from "@/modules/data_management/components/upload_section/tables/ContactSelection";
import { useGetContactImports } from "@/modules/data_management/hooks/useGetContactImports";
import { useCoreStore } from "@/modules/core/stores/core";
import { ContactsValidation } from "../../services/data_upload/validation/ContactsValidation";
import { FileUploadButton } from "@/modules/core/components/ui/FileUploadButton";

export const ContactUpload = ({ onSubmit = () => {} }: { onSubmit?: () => void }) => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const contactImports = useGetContactImports();
    const setContactSelectionActive = useDataManagementStore((state) => state.setContactSelectionActive);
    const contactSelectionActive = useDataManagementStore((state) => state.contactSelectionActive);
    const cases = useCoreStore((state) => state.casesWithRelationships);

    const handleSubmit = async () => {
        const persistenceStrategy = new ContactsPersistence();
        try {
            await persistenceStrategy.executePersist();
            onSubmit();
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
            <div
                className={`flex flex-col gap-3 ${
                    cases.length === 0 ? "pointer-events-none opacity-50" : "opacity-100"
                }`}
            >
                <div className="flex flex-row items-end gap-3">
                    <FileUploadButton type="contacts" validationStrategy={new ContactsValidation()} />
                </div>
            </div>
            <small
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: t(`upload.help.cases`) }}
            ></small>
            {contactImports && (
                <Dialog
                    onOpenChange={(open) => {
                        setContactSelectionActive(open);
                        if (!open) {
                            useDataManagementStore.getState().clearCaseImports();
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
