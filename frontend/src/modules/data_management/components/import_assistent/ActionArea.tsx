import { useDataManagementStore } from "../../stores/dataManagement";
import { SequenceAnalysisStatus } from "../sequence_analysis/SequenceAnalysisStatus";
import { CasesPersistence } from "../../services/data_import/persistence/CasesPersistence";
import { CasesValidation } from "../../services/data_import/validation/CasesValidation";
import { SamplesPersistence } from "../../services/data_import/persistence/SamplesPersistence";
import { SamplesValidation } from "../../services/data_import/validation/SamplesValidation";
import { ContactsPersistence } from "../../services/data_import/persistence/ContactsPersistence";
import { ContactsValidation } from "../../services/data_import/validation/ContactsValidation";
import { Button } from "@/modules/core/components/ui/Button";
import { ContactRound, Dna, UsersRound } from "lucide-react";
import { useCoreStore } from "@/modules/core/stores/core";
import { Link } from "react-router-dom";
import { CaseSelection } from "../import_section/tables/CaseSelection";
import { DataImport } from "../import_section/DataImport";
import { SequenceSelection } from "../import_section/tables/SequenceSelection";
import { ContactSelection } from "../import_section/tables/ContactSelection";

export function ActionArea() {
    const persistedCasesForPathogen = useCoreStore((state) => state.casesWithRelationships);
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
                        <Button onClick={nextInitialUploadStep}>Import starten</Button>
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
                            type="case"
                            actions={
                                <Button variant="secondary" onClick={previousInitialUploadStep}>
                                    Zurück
                                </Button>
                            }
                            icon={<ContactRound />}
                        >
                            <CaseSelection />
                        </DataImport>
                        {Object.keys(caseImports).length === 0 && (
                            <div className="flex justify-end gap-4">
                                <Button variant="secondary" onClick={previousInitialUploadStep}>
                                    Zurück
                                </Button>
                                {Object.keys(persistedCasesForPathogen).length > 0 && (
                                    <Button onClick={nextInitialUploadStep}>Weiter</Button>
                                )}
                            </div>
                        )}
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
                            type="sequence"
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
                            type="contact"
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
                                    <Button onClick={resetInitialUpload}>Zum Dashboard</Button>
                                </Link>
                                <Link to="/outbreak-analysis">
                                    <Button onClick={resetInitialUpload}>Zu den Ausbruchsanalysen</Button>
                                </Link>
                                <Link to="/data-management">
                                    <Button onClick={resetInitialUpload}>Zur Datenverwaltung</Button>
                                </Link>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return getImportComponentBasedOnInitalUploadStep();
}
