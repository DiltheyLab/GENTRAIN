import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Dialog, DialogContent, DialogFooter } from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { SamplesPersistence } from "@/modules/data_management/services/data_upload/persistence/SamplesPersistence";
import { SampleSelection } from "@/modules/data_management/components/upload_section/tables/SampleSelection";
import { useGetSampleImports } from "@/modules/data_management/hooks/useGetSampleImports";

export const SampleUpload = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const sampleImports = useGetSampleImports();
    const setSampleSelectionActive = useDataManagementStore((state) => state.setSampleSelectionActive);
    const clearSampleImports = useDataManagementStore((state) => state.clearSampleImports);
    const sampleSelectionActive = useDataManagementStore((state) => state.sampleSelectionActive);

    const handleSubmit = async () => {
        const persistenceStrategy = new SamplesPersistence();
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
        }
    };

    return (
        <>
            <small
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: t(`upload.help.samples`) }}
            ></small>
            {sampleImports && (
                <Dialog
                    onOpenChange={(open) => {
                        setSampleSelectionActive(open);
                        if (!open) {
                            clearSampleImports();
                        }
                    }}
                    open={sampleSelectionActive}
                >
                    <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                        {sampleSelectionActive && (
                            <>
                                <SampleSelection />
                                <DialogFooter>
                                    <Button onClick={handleSubmit}>Sequenzen hinzufügen</Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};
