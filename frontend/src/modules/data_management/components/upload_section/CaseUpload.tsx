import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Dialog, DialogContent, DialogFooter } from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { CasesPersistence } from "@/modules/data_management/services/data_upload/persistence/CasesPersistence";
import { CaseSelection } from "@/modules/data_management/components/upload_section/tables/CaseSelection";
import { CaseUpdate } from "@/modules/data_management/components/upload_section/tables/CaseUpdate";
import { useGetCaseImports } from "@/modules/data_management/hooks/useGetCaseImports";
import { CasesValidation } from "../../services/data_upload/validation/CasesValidation";
import { FileDropzone } from "./FileDropzone";
import { ContactRound } from "lucide-react";

export const CaseUpload = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const caseImports = useGetCaseImports();
    const setCaseSelectionActive = useDataManagementStore((state) => state.setCaseSelectionActive);
    const caseSelectionActive = useDataManagementStore((state) => state.caseSelectionActive);
    const setInitialUploadStep = useDataManagementStore((state) => state.setInitialUploadStep);

    const handleSubmit = async () => {
        const persistenceStrategy = new CasesPersistence();
        try {
            await persistenceStrategy.executePersist();
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
        } finally {
            setInitialUploadStep("samples");
        }
    };

    const handleUpdate = async () => {
        const persistenceStrategy = new CasesPersistence();
        try {
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

    return (
        <div className="w-full h-full">
            <div className="flex flex-col gap-3 h-full">
                <div className="flex flex-row items-end gap-3 h-full">
                    <FileDropzone
                        label="Falldaten"
                        type="cases"
                        icon={<ContactRound width={50} height={50} />}
                        validationStrategy={new CasesValidation()}
                    />
                </div>
            </div>
            {caseImports && (caseImports.create || caseImports.update) && (
                <Dialog
                    onOpenChange={(open) => {
                        setCaseSelectionActive(open);
                        if (!open) {
                            useDataManagementStore.getState().clearCaseImports();
                            useDataManagementStore.getState().clearExistingCases();
                        }
                    }}
                    open={caseSelectionActive}
                >
                    <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                        {caseSelectionActive && !caseImports.update && caseImports.create && (
                            <>
                                <CaseSelection />
                                <DialogFooter>
                                    <Button onClick={handleSubmit}>Fälle hinzufügen</Button>
                                </DialogFooter>
                            </>
                        )}
                        {caseSelectionActive && caseImports.update && (
                            <>
                                <CaseUpdate />
                                <DialogFooter>
                                    <Button onClick={handleUpdate}>Fälle aktualisieren</Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};
