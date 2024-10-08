import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Dialog, DialogContent, DialogFooter } from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { SamplesPersistence } from "@/modules/data_management/services/data_upload/persistence/SamplesPersistence";
import { useGetSampleUploads } from "@/modules/data_management/hooks/useGetSampleUploads";
import { SampleSelection } from "@/modules/data_management/components/upload_section/tables/SampleSelection";

export const SampleUpload = ({ onSubmit }: { onSubmit: () => void }) => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const sampleUploads = useGetSampleUploads();
    const setSampleSelectionActive = useDataManagementStore((state) => state.setSampleSelectionActive);
    const clearSampleUploads = useDataManagementStore((state) => state.clearSampleUploads);
    const sampleSelectionActive = useDataManagementStore((state) => state.sampleSelectionActive);

    const handleSubmit = async () => {
        const persistenceStrategy = new SamplesPersistence();
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
            <small
                className="text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: t(`upload.help.samples`) }}
            ></small>
            {sampleUploads && (
                <Dialog
                    onOpenChange={(open) => {
                        setSampleSelectionActive(open);
                        if (!open) {
                            clearSampleUploads();
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
