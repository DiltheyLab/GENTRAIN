import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Dialog, DialogContent, DialogFooter } from "@/modules/core/components/ui/Dialog";
import { CaseSelection } from "./CaseSelection";
import { useDataManagementStore } from "../../stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { CasesPersistence } from "../../services/data_upload/persistence/CasesPersistence";
import { CaseUpdate } from "./CaseUpdate";
import { useGetCaseUploads } from "../../hooks/useGetCaseUploads";

export const CasesUpload = ({ onSubmit }: { onSubmit: () => void }) => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const caseUploads = useGetCaseUploads();
    const setCaseSelectionActive = useDataManagementStore((state) => state.setCaseSelectionActive);
    const caseSelectionActive = useDataManagementStore((state) => state.caseSelectionActive);

    const handleSubmit = async () => {
        const persistenceStrategy = new CasesPersistence();
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
        <>
            <small
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: t(`upload.help.cases`) }}
            ></small>
            {caseUploads && (caseUploads.create || caseUploads.update) && (
                <Dialog
                    onOpenChange={(open) => {
                        setCaseSelectionActive(open);
                        if (!open) {
                            useDataManagementStore.getState().clearCaseUploads();
                            useDataManagementStore.getState().clearExistingCases();
                        }
                    }}
                    open={caseSelectionActive}
                >
                    <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                        {caseSelectionActive && !caseUploads.update && caseUploads.create && (
                            <>
                                <CaseSelection />
                                <DialogFooter>
                                    <Button onClick={handleSubmit}>Fälle hinzufügen</Button>
                                </DialogFooter>
                            </>
                        )}
                        {caseSelectionActive && caseUploads.update && (
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
        </>
    );
};
