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
import { SamplesValidation } from "../../services/data_upload/validation/SamplesValidation";
import { useCoreStore } from "@/modules/core/stores/core";
import { FileDropzone } from "./FileDropzone";
import { Dna } from "lucide-react";

export const SampleUpload = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const sampleImports = useGetSampleImports();
    const setSampleSelectionActive = useDataManagementStore((state) => state.setSampleSelectionActive);
    const clearSampleImports = useDataManagementStore((state) => state.clearSampleImports);
    const sampleSelectionActive = useDataManagementStore((state) => state.sampleSelectionActive);
    const cases = useCoreStore((state) => state.casesWithRelationships);
    const setInitialUploadStep = useDataManagementStore((state) => state.setInitialUploadStep);

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
        } finally {
            setInitialUploadStep("contacts");
        }
    };

    return (
        <div className="w-1/3">
            <div
                className={`flex flex-col gap-3 ${
                    cases.length === 0 ? "pointer-events-none opacity-50" : "opacity-100"
                }`}
            >
                <div className="flex flex-row items-end gap-3">
                    <FileDropzone
                        label="Sequenzdaten"
                        type="samples"
                        icon={<Dna width={50} height={50} />}
                        validationStrategy={new SamplesValidation()}
                    />
                </div>
            </div>
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
        </div>
    );
};
