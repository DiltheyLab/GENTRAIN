import { useCoreStore } from "@/modules/core/stores/core";
import { DataImport } from "./DataImport";
import { CasesPersistence } from "../../services/data_import/persistence/CasesPersistence";
import { CasesValidation } from "../../services/data_import/validation/CasesValidation";
import { useDataManagementStore } from "../../stores/dataManagement";
import { CaseSelection } from "./tables/CaseSelection";
import { SequenceAnalysesPersistence } from "../../services/data_import/persistence/SequenceAnalysesPersistence";
import { SequencesValidation } from "../../services/data_import/validation/SequencesValidation";
import { ContactsPersistence } from "../../services/data_import/persistence/ContactsPersistence";
import { ContactsValidation } from "../../services/data_import/validation/ContactsValidation";
import { ContactSelection } from "./tables/ContactSelection";
import { ContactRound, Dna, UsersRound } from "lucide-react";
import { Button } from "@/modules/core/components/ui/Button";

export const ImportSection = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const casesForActivePathogen = useCoreStore((state) => state.casesWithRelationships);
    const caseImports = useDataManagementStore((state) => state.caseImports);
    const sequenceImports = useDataManagementStore((state) => state.sequenceImports);
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
                        type="case"
                        icon={<ContactRound />}
                        exampleDataPath={activePathogen?.cases_example}
                    >
                        <CaseSelection />
                    </DataImport>
                </div>
                <div className="w-1/3">
                    <DataImport
                        data={sequenceImports}
                        persistenceStrategy={new SequenceAnalysesPersistence()}
                        validationStrategy={new SequencesValidation()}
                        type="sequence"
                        icon={<Dna />}
                        exampleDataPath={activePathogen?.sequences_example}
                    ></DataImport>
                </div>
                <div className="w-1/3">
                    <DataImport
                        data={contactImports}
                        persistenceStrategy={new ContactsPersistence()}
                        validationStrategy={new ContactsValidation()}
                        type="contact"
                        icon={<UsersRound />}
                        exampleDataPath={activePathogen?.contacts_example}
                        disable={casesForActivePathogen.length === 0}
                    >
                        <ContactSelection />
                    </DataImport>
                </div>
            </div>
        </div>
    );
};
