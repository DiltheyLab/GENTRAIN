import { useCoreStore } from "@/modules/core/stores/core";
import { DataImport } from "./DataImport";
import { CasesPersistence } from "../../services/data_import/persistence/CasesPersistence";
import { CasesValidation } from "../../services/data_import/validation/CasesValidation";
import { useDataManagementStore } from "../../stores/dataManagement";
import { CaseSelection } from "./tables/CaseSelection";
import { SamplesPersistence } from "../../services/data_import/persistence/SamplesPersistence";
import { SamplesValidation } from "../../services/data_import/validation/SamplesValidation";
import { SequenceSelection } from "./tables/SequenceSelection";
import { ContactsPersistence } from "../../services/data_import/persistence/ContactsPersistence";
import { ContactsValidation } from "../../services/data_import/validation/ContactsValidation";
import { ContactSelection } from "./tables/ContactSelection";
import { ContactRound, Dna, UsersRound } from "lucide-react";
import { Button } from "@/modules/core/components/ui/Button";
import { downloadFileFromUrl } from "@/modules/core/helpers/files";

export const ImportSection = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const casesForActivePathogen = useCoreStore((state) => state.casesWithRelationships);
    const caseImports = useDataManagementStore((state) => state.caseImports);
    const sampleImports = useDataManagementStore((state) => state.sampleImports);
    const contactImports = useDataManagementStore((state) => state.contactImports);
    const setShowImportAssistent = useDataManagementStore((state) => state.setShowImportAssistent);

    return (
        <div data-tutorial-tour-step="data-management-import" className="bg-white rounded-lg p-3">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Daten für {activePathogen?.name} importieren</h2>
                    <p className="text-muted-foreground">
                        Fügen Sie hier Falldaten zu {activePathogen?.name} hinzu. Zu jedem importierten Fall können
                        Sequenz- sowie Kontaktdaten hinterlegt werden.
                    </p>
                </div>
                <div className="flex gap-4">
                    {activePathogen?.example_data_path && (
                        <Button
                            variant="secondary"
                            onClick={() =>
                                downloadFileFromUrl(
                                    `${import.meta.env.VITE_API_HOST}/static/pathogen_example_data/${
                                        activePathogen?.example_data_path
                                    }`
                                )
                            }
                        >
                            Beispieldaten herunterladen
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => setShowImportAssistent(true)}>
                        Import-Assistent starten
                    </Button>
                </div>
            </div>
            <div className="flex gap-8">
                <div className="w-1/3">
                    <DataImport
                        data={caseImports}
                        persistenceStrategy={new CasesPersistence()}
                        validationStrategy={new CasesValidation()}
                        dialog
                        type="case"
                        icon={<ContactRound />}
                    >
                        <CaseSelection />
                    </DataImport>
                </div>
                <div className="w-1/3">
                    <DataImport
                        data={sampleImports}
                        persistenceStrategy={new SamplesPersistence()}
                        validationStrategy={new SamplesValidation()}
                        dialog
                        type="sequence"
                        icon={<Dna />}
                        disable={casesForActivePathogen.length === 0}
                    >
                        <SequenceSelection />
                    </DataImport>
                </div>
                <div className="w-1/3">
                    <DataImport
                        data={contactImports}
                        persistenceStrategy={new ContactsPersistence()}
                        validationStrategy={new ContactsValidation()}
                        dialog
                        type="contact"
                        icon={<UsersRound />}
                        disable={casesForActivePathogen.length === 0}
                    >
                        <ContactSelection />
                    </DataImport>
                </div>
            </div>
        </div>
    );
};
