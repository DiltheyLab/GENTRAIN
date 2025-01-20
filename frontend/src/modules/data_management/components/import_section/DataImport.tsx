import { useToast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getToastDescription } from "@/modules/core/helpers/errors";
import { useTranslation } from "react-i18next";
import { ZodError } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { FileDropzone } from "./FileDropzone";
import { ValidationStrategy } from "../../services/data_import/validation/ValidationStrategy";
import { PersistenceStrategy } from "../../services/data_import/persistence/PersistenceStrategy";
import { CaseImport, CaseSchema } from "@/modules/core/models/cases";
import { SampleImport, SampleSchema } from "@/modules/core/models/samples";
import { ContactImport, ContactSchema } from "@/modules/core/models/contacts";
import { useState } from "react";
import { renderHtmlFromTranslation } from "@/modules/core/helpers/translations";
import { downloadFileFromUrl } from "@/modules/core/helpers/files";
import { FileDown } from "lucide-react";

type DataImportProps = {
    children: JSX.Element;
    data: ImportData;
    persistenceStrategy: PersistenceStrategy;
    validationStrategy: ValidationStrategy;
    actions?: JSX.Element | JSX.Element[];
    buttonText?: string;
    inlineSelection?: boolean;
    type: string;
    icon?: JSX.Element | null;
    exampleDataPath?: string | null;
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
    persistenceStrategy,
    validationStrategy,
    actions,
    inlineSelection = false,
    type,
    icon = null,
    exampleDataPath = null,
    disable = false,
}: DataImportProps) => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const clearImports = useDataManagementStore((state) => state.clearImports);
    const nextImportAssistentStep = useDataManagementStore((state) => state.nextImportAssistentStep);
    const showImportAssistent = useDataManagementStore((state) => state.showImportAssistent);
    const [openDialog, setOpenDialog] = useState(false);

    const renderDropzone = () => {
        // hide dropzone for inline selection if data was uploaded
        if (inlineSelection && Object.keys(data).length > 0) return;
        return (
            <div className={`flex flex-col gap-3 h-full`}>
                <div className="flex flex-col items-center gap-3 h-full">
                    <FileDropzone
                        type={type}
                        icon={icon}
                        validationStrategy={validationStrategy}
                        onFileUpload={() => setOpenDialog(true)}
                    />
                </div>
            </div>
        );
    };

    const renderDataSelection = () => {
        if (Object.keys(data).length === 0) return;
        // render inline version if assistent is active and correspending data was uploaded
        if (inlineSelection && showImportAssistent) {
            return (
                <>
                    {children}
                    <div className="flex justify-end gap-4">
                        {actions}
                        <Button onClick={handleSubmit}>{t(`import:labels.${type}`)} hinzufügen</Button>
                    </div>
                </>
            );
        }
        // always render dialog version if assistent is inactive
        if (!showImportAssistent) {
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
                    <DialogContent
                        className="max-w-[1000px] w-[calc(100vw-50px)] max-h-[90%] h-full flex flex-col justify-around"
                        onInteractOutside={(e) => e.preventDefault()}
                    >
                        <DialogHeader className="py-4">
                            <DialogTitle>{t(`import:titles.${type}_selection`)}</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        {renderHtmlFromTranslation(`import:${type}_selection.shared`)}
                        {children}
                        <DialogFooter className="flex items-center py-4">
                            <div className="flex justify-end">
                                {actions}
                                <Button onClick={handleSubmit}>{t(`import:labels.${type}`)} hinzufügen</Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        }
    };

    const handleSubmit = async () => {
        setOpenDialog(false);
        nextImportAssistentStep();
        try {
            await persistenceStrategy.execute();
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
        <div className="flex flex-col items-center gap-1">
            <div className={`w-full h-full ${disable ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
                {renderDropzone()}
                {renderDataSelection()}
            </div>
            {exampleDataPath && (
                <Button
                    variant="link"
                    className="hover:text-primary hover:no-underline"
                    onClick={() => downloadFileFromUrl(`${import.meta.env.VITE_API_HOST}/${exampleDataPath}`)}
                >
                    Exemplarische {t(`import:labels.${type}`)} herunterladen <FileDown className="h-5 w-5 ml-1" />
                </Button>
            )}
        </div>
    );
};
