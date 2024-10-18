import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { FileDropzone } from "./FileDropzone";
import { ValidationStrategy } from "../../services/data_import/validation/ValidationStrategy";
import { PersistenceStrategy } from "../../services/data_import/persistence/PersistenceStrategy";
import { CaseImport, CaseSchema } from "@/modules/core/models/cases";
import { SampleImport, SampleSchema } from "@/modules/core/models/samples";
import { ContactImport, ContactSchema } from "@/modules/core/models/contacts";
import { useState } from "react";

type DataImportParameters = {
    children: JSX.Element;
    data: ImportData;
    submitStrategy: PersistenceStrategy;
    validationStrategy: ValidationStrategy;
    actions?: JSX.Element | JSX.Element[];
    buttonText?: string;
    dialog?: boolean;
    type: string;
    icon?: JSX.Element | null;
    disable?: boolean;
};

type ImportData = {
    [id: string]: {
        imported: CaseImport | SampleImport | ContactImport;
        persisted: CaseSchema | SampleSchema | ContactSchema | null;
        import: boolean;
        status?: string;
    };
};

export const DataImport = ({
    children,
    data,
    submitStrategy,
    validationStrategy,
    actions,
    dialog = false,
    type,
    icon = null,
    disable = false,
}: DataImportParameters) => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const clearImports = useDataManagementStore((state) => state.clearImports);
    const nextInitialUploadStep = useDataManagementStore((state) => state.nextInitialUploadStep);
    const showInitialUpload = useDataManagementStore((state) => state.showInitialUpload);
    const [openDialog, setOpenDialog] = useState(false);

    const renderDataSelection = () => {
        if (Object.keys(data).length === 0) return;
        if (dialog) {
            return (
                <Dialog
                    onOpenChange={(open) => {
                        setOpenDialog(false);
                        if (!open) {
                            clearImports();
                        }
                    }}
                    open={openDialog}
                >
                    <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                        <DialogTitle>
                            Es wurden bereits bestehende {t(`upload.label.${type}`)} hinzugefügt. Möchten Sie diese
                            hinzufügen?
                        </DialogTitle>
                        <DialogDescription>
                            Folgende {t(`upload.label.${type}`)} wurden in der CSV-Datei und im bestehenden Datenbestand
                            gefunden. Alle ausgewählte Fälle werden aktualisiert.
                        </DialogDescription>
                        {children}
                        <div className="flex justify-end">
                            {actions}
                            <Button onClick={handleSubmit}>{t(`upload.label.${type}`)} hinzufügen</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        }
        return (
            <>
                {children}
                <div className="flex justify-end gap-4">
                    {actions}
                    <Button onClick={handleSubmit}>{t(`upload.label.${type}`)} hinzufügen</Button>
                </div>
            </>
        );
    };

    const handleSubmit = async () => {
        setOpenDialog(false);
        nextInitialUploadStep();
        try {
            await submitStrategy.execute();
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
        <div className={`w-full h-full ${disable ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
            {(!showInitialUpload || (showInitialUpload && Object.keys(data).length === 0)) && (
                <div className={`flex flex-col gap-3 h-full`}>
                    <div className="flex flex-col items-end gap-3 h-full">
                        <FileDropzone
                            type={type}
                            icon={icon}
                            validationStrategy={validationStrategy}
                            onFileUpload={() => setOpenDialog(true)}
                        />
                    </div>
                </div>
            )}
            {renderDataSelection()}
        </div>
    );
};
