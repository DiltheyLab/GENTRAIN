import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";
import { useDataManagementStore } from "../../stores/dataManagement";
import { SequenceAnalysisStatus } from "../sequence_analysis/SequenceAnalysisStatus";
import { CasesPersistence } from "../../services/data_import/persistence/CasesPersistence";
import { CasesValidation } from "../../services/data_import/validation/CasesValidation";
import { CaseSelection } from "./tables/CaseSelection";
import { DataImport } from "./DataImport";
import { SequenceSelection } from "./tables/SequenceSelection";
import { SamplesPersistence } from "../../services/data_import/persistence/SamplesPersistence";
import { SamplesValidation } from "../../services/data_import/validation/SamplesValidation";
import { ContactsPersistence } from "../../services/data_import/persistence/ContactsPersistence";
import { ContactsValidation } from "../../services/data_import/validation/ContactsValidation";
import { ContactSelection } from "./tables/ContactSelection";
import { Button } from "@/modules/core/components/ui/Button";
import { ContactRound, Dna, UsersRound } from "lucide-react";
import { useCoreStore } from "@/modules/core/stores/core";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function InitialUploadDialog() {
    const { t, i18n } = useTranslation();
    const [opened, setOpened] = useState(true);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const initalUploadStep = useDataManagementStore((state) => state.initialUploadStep);
    const previousInitialUploadStep = useDataManagementStore((state) => state.previousInitialUploadStep);
    const nextInitialUploadStep = useDataManagementStore((state) => state.nextInitialUploadStep);
    const resetInitialUpload = useDataManagementStore((state) => state.resetInitialUpload);
    const caseImports = useDataManagementStore((state) => state.caseImports);
    const sampleImports = useDataManagementStore((state) => state.sampleImports);
    const contactImports = useDataManagementStore((state) => state.contactImports);

    const getImportComponentBasedOnInitalUploadStep = () => {
        switch (initalUploadStep) {
            case "introduction":
                return (
                    <div className="flex justify-end">
                        <Button onClick={nextInitialUploadStep}>Starten</Button>
                    </div>
                );
            case "case_import":
            case "case_selection":
                return (
                    <>
                        <DataImport
                            data={caseImports}
                            submitStrategy={new CasesPersistence()}
                            validationStrategy={new CasesValidation()}
                            type="cases"
                            actions={
                                <Button variant="secondary" onClick={previousInitialUploadStep}>
                                    Zurück
                                </Button>
                            }
                            icon={<ContactRound />}
                        >
                            <CaseSelection />
                        </DataImport>
                    </>
                );
            case "sequence_import":
            case "sequence_selection":
                return (
                    <>
                        <DataImport
                            data={sampleImports}
                            submitStrategy={new SamplesPersistence()}
                            validationStrategy={new SamplesValidation()}
                            type="samples"
                            actions={
                                <Button variant="secondary" onClick={previousInitialUploadStep}>
                                    Zurück
                                </Button>
                            }
                            icon={<Dna />}
                        >
                            <SequenceSelection />
                        </DataImport>
                        {Object.keys(sampleImports).length === 0 && (
                            <div className="flex justify-end gap-4">
                                <Button variant="secondary" onClick={previousInitialUploadStep}>
                                    Zurück
                                </Button>
                                <Button variant="secondary" onClick={nextInitialUploadStep}>
                                    Überspringen
                                </Button>
                            </div>
                        )}
                    </>
                );
            case "sequence_introduction":
                return (
                    <div className="flex justify-end gap-4">
                        <Button variant="secondary" onClick={previousInitialUploadStep}>
                            Zurück
                        </Button>
                        <Button onClick={nextInitialUploadStep}>Weiter</Button>
                    </div>
                );
            case "sequence_analysis":
                return (
                    <>
                        <SequenceAnalysisStatus />
                        <div className="flex justify-end gap-4">
                            <Button variant="secondary" onClick={previousInitialUploadStep}>
                                Zurück
                            </Button>
                            <Button onClick={nextInitialUploadStep}>Weiter</Button>
                        </div>
                    </>
                );
            case "contact_import":
            case "contact_selection":
                return (
                    <>
                        <DataImport
                            data={contactImports}
                            submitStrategy={new ContactsPersistence()}
                            validationStrategy={new ContactsValidation()}
                            type="contacts"
                            actions={
                                <Button variant="secondary" onClick={previousInitialUploadStep}>
                                    Zurück
                                </Button>
                            }
                            icon={<UsersRound />}
                        >
                            <ContactSelection />
                        </DataImport>
                        {Object.keys(contactImports).length === 0 && (
                            <div className="flex justify-end gap-4">
                                <Button variant="secondary" onClick={previousInitialUploadStep}>
                                    Zurück
                                </Button>
                                <Button variant="secondary" onClick={nextInitialUploadStep}>
                                    Überspringen
                                </Button>
                            </div>
                        )}
                    </>
                );
            case "conclusion":
                return (
                    <>
                        <div>
                            <div className="flex justify-end gap-4 mt-4">
                                <Link to="/">
                                    <Button onClick={closeInitialUpload}>Zum Dashboard</Button>
                                </Link>
                                <Link to="/outbreak-analysis">
                                    <Button onClick={closeInitialUpload}>Zu den Ausbruchsanalysen</Button>
                                </Link>
                                <Link to="/data-management">
                                    <Button onClick={closeInitialUpload}>Zur Datenverwaltung</Button>
                                </Link>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const closeInitialUpload = () => {
        setOpened(!opened);
        resetInitialUpload();
    };

    const renderHtmlFromTranslation = (i18nKey: string) => {
        const elements: { tag: "p" | "code"; content: string }[] | { tag: "ul"; content: string[] }[] = t(i18nKey, {
            returnObjects: true,
        });
        return elements.map((element) => {
            switch (element.tag) {
                case "p":
                    return (
                        <p>
                            <Trans shouldUnescape>{element.content}</Trans>
                        </p>
                    );
                case "ul":
                    return (
                        <ul className="list-disc pl-4">
                            {element.content.map((child) => (
                                <li>
                                    <Trans>{child}</Trans>
                                </li>
                            ))}
                        </ul>
                    );
                case "code":
                    return (
                        <code className="p-8 bg-muted rounded-lg">
                            <Trans shouldUnescape>{element.content}</Trans>
                        </code>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <Dialog open={opened} onOpenChange={closeInitialUpload}>
            <DialogContent className="max-w-[1000px] w-[calc(100vw-50px)]">
                <DialogHeader>
                    <DialogTitle>{t(`import:guide:titles:${initalUploadStep}`)}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                {i18n.exists(`import:guide:${initalUploadStep}:shared`) &&
                    renderHtmlFromTranslation(`import:guide:${initalUploadStep}:shared`)}
                {i18n.exists(`import:guide:${initalUploadStep}:${activePathogen?.pathogen_type?.name}`) &&
                    renderHtmlFromTranslation(
                        `import:guide:${initalUploadStep}:${activePathogen?.pathogen_type?.name}`
                    )}
                {getImportComponentBasedOnInitalUploadStep()}
            </DialogContent>
        </Dialog>
    );
}
