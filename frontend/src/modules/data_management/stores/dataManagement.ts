import { create } from "zustand";
import { CaseImport, CaseSchema, CaseWithRelationships } from "@/modules/core/models/cases";
import { ContactImport, ContactSchema } from "@/modules/core/models/contacts";
import { toast } from "@/modules/core/components/ui/UseToast";
import { CaseImports, SequenceImports } from "../types/import";
import { SequenceImport } from "@/modules/core/models/sequence_analyses";
import { persist } from "zustand/middleware";
import { DatabaseName } from "@/modules/core/services/database/DatabaseManager";

type DataManagementStoreState = {
    // case import
    caseImports: CaseImports;
    caseSelectionActive: boolean;
    failedCaseImports: { [caseId: string]: string[] };

    // sequence import
    sequenceImports: SequenceImports;
    sequenceSelectionActive: boolean;
    showSequenceUploadStatus: boolean;
    hideSequenceUploadContent: boolean;
    sequenceAnalysisRunning: boolean;
    distanceCalculationRunning: boolean;
    isUploading: boolean;
    distanceCalculationCount: number;
    distanceCalculationSum: number;
    failedSequenceImports: string[];
    scrollToSequence: string | null;

    // contact import
    contactImports: { [id: string]: { imported: ContactImport; persisted: ContactSchema | null; import: boolean } };
    contactSelectionActive: boolean;

    // initial upload modal
    importAssistentStep: string | null;
    showImportAssistent: boolean;

    // sequence mapping
    sequenceMappingDialogCase: CaseWithRelationships | null;

    // database operations
    indexedDbTtlIsEnabled: boolean;
    indexedDbExpiresAt?: number;
    deleteIndexedDbOnExit: boolean;
    selectedDB?: DatabaseName;
};

type DataManagementStoreActions = {
    clearImports: () => void;

    // case import
    changeCaseImport: (key: string, value: any) => void;
    removeCaseImport: (key: string) => void;
    setCaseImports: (caseImports: {
        [id: string]: { imported: CaseImport; persisted: CaseSchema | null; import: boolean };
    }) => void;
    clearCaseImports: () => void;
    setCaseSelectionActive: (value: boolean) => void;
    setFailedCaseImports: (failedCaseImports: { [caseId: string]: string[] }) => void;

    // sequence import
    changeSequenceImport: (key: string, value: any) => void;
    removeSequenceImport: (key: string) => void;
    setSequenceImports: (imports: { [fastaHash: string]: SequenceImport }) => void;
    clearSequenceImports: () => void;
    setSequenceSelectionActive: (value: boolean) => void;
    setShowSequenceUploadStatus: (value: boolean) => void;
    setHideSequenceUploadContent: (value: boolean) => void;
    setSequenceAnalysisRunning: (value: boolean) => void;
    setDistanceCalculationRunning: (value: boolean) => void;
    setIsUploading: (value: boolean) => void;
    incrementDistanceCalculationCount: () => void;
    setDistanceCalculationSum: (sum: number) => void;
    resetSequenceUpload: () => void;
    setFailedSequenceImports: (fastaHash: string[]) => void;
    setScrollToSequence: (fastaId: string) => void;

    // contact import
    changeContactImport: (key: string, value: any) => void;
    removeContactImport: (key: string) => void;
    setContactImports: (contactImports: {
        [id: string]: { imported: ContactImport; persisted: ContactSchema | null; import: boolean };
    }) => void;
    clearContactImports: () => void;
    setContactSelectionActive: (value: boolean) => void;

    // initial upload modal
    previousImportAssistentStep: () => void;
    nextImportAssistentStep: () => void;
    setShowImportAssistent: (value: boolean) => void;
    resetImportAssistent: (triggerSuccessToast?: boolean) => void;

    // sequence mapping
    initSequenceMappingDialog: (focusedCase: CaseWithRelationships) => void;
    hideSequenceMappingDialog: () => void;

    // database operations
    setIndexedDbTtlIsEnabled: (isEnabled: boolean) => void;
    setIndexedDbExpiresAt: (hours: number) => void;
    setDeleteIndexedDbOnExit: (isActive: boolean) => void;
    setSelectedDB: (db: DatabaseName) => void;
};

export type DataManagementStore = DataManagementStoreState & DataManagementStoreActions;

export const useDataManagementStore = create<DataManagementStore>()(
    persist(
        (set, get) => ({
            clearImports: () => {
                set({ caseImports: {}, sequenceImports: {}, contactImports: {} });
            },
            // case import
            caseImports: {},
            changeCaseImport: (caseId: string, value: any) => {
                const updatedCaseImports = structuredClone(get().caseImports);
                const caseImport = {
                    ...updatedCaseImports[caseId],
                    ...value,
                };
                updatedCaseImports[caseId] = caseImport;
                set({ caseImports: updatedCaseImports });
            },
            removeCaseImport: (caseId: string) => {
                const updatedCaseImports = structuredClone(get().caseImports);
                delete updatedCaseImports[caseId];
                set({ caseImports: updatedCaseImports });
            },
            setCaseImports: (caseImports: {
                [id: string]: {
                    imported: CaseImport;
                    persisted: CaseSchema | null;
                    import: boolean;
                };
            }) => {
                set({ caseImports: caseImports ?? null });
            },
            clearCaseImports: () => {
                set({ caseImports: {} });
            },
            failedCaseImports: {},
            setFailedCaseImports: (failedCases: { [caseId: string]: string[] }) => {
                set({ failedCaseImports: failedCases });
            },
            caseSelectionActive: false,
            setCaseSelectionActive: (value: boolean) => {
                set({ caseSelectionActive: value });
            },
            // sequence import
            sequenceImports: {},
            changeSequenceImport: (fastaId: string, changes: any) => {
                const updatedSequenceImports = structuredClone(get().sequenceImports);
                const sequenceImport = { ...updatedSequenceImports[fastaId], ...changes };
                updatedSequenceImports[fastaId] = sequenceImport;
                set({ sequenceImports: updatedSequenceImports });
            },
            setSequenceImports: (imports: { [fastaId: string]: SequenceImport }) => {
                set({ sequenceImports: imports });
            },
            removeSequenceImport: (fastaId: string) => {
                const updatedSequenceImports = structuredClone(get().sequenceImports);
                delete updatedSequenceImports[fastaId];
                set({ sequenceImports: updatedSequenceImports });
            },
            clearSequenceImports: () => {
                set({ sequenceImports: {} });
            },
            sequenceSelectionActive: false,
            setSequenceSelectionActive: (value: boolean) => {
                set({ sequenceSelectionActive: value });
            },
            showSequenceUploadStatus: false,
            setShowSequenceUploadStatus: (value: boolean) => {
                set({ showSequenceUploadStatus: value });
            },
            hideSequenceUploadContent: false,
            setHideSequenceUploadContent: (value: boolean) => {
                set({ hideSequenceUploadContent: value });
            },
            sequenceAnalysisRunning: false,
            setSequenceAnalysisRunning: (value: boolean) => {
                set({ sequenceAnalysisRunning: value });
            },
            distanceCalculationRunning: false,
            setDistanceCalculationRunning: (value: boolean) => {
                set({ distanceCalculationRunning: value });
            },
            isUploading: false,
            setIsUploading: (value: boolean) => {
                set({ isUploading: value });
            },
            distanceCalculationCount: 0,
            incrementDistanceCalculationCount: () => {
                const newCount = get().distanceCalculationCount + 1;
                set({ distanceCalculationCount: newCount });
            },
            distanceCalculationSum: 0,
            setDistanceCalculationSum: (sum: number) => {
                set({ distanceCalculationSum: sum });
            },
            resetSequenceUpload: () => {
                set({
                    distanceCalculationCount: 0,
                    distanceCalculationSum: 0,
                    isUploading: false,
                    showSequenceUploadStatus: false,
                    hideSequenceUploadContent: false,
                    sequenceImports: {},
                });
            },
            failedSequenceImports: [],
            setFailedSequenceImports: (fastaIds: string[]) => {
                set({ failedSequenceImports: fastaIds });
            },
            scrollToSequence: null,
            setScrollToSequence: (fastaHash: string) => {
                set({ scrollToSequence: fastaHash });
            },
            // contact import
            contactImports: {},
            changeContactImport: (contactId: string, changes: any) => {
                const updatedContactImports = structuredClone(get().contactImports);
                const contactImport = { ...updatedContactImports[contactId], ...changes };
                updatedContactImports[contactId] = contactImport;
                set({ contactImports: updatedContactImports });
            },
            setContactImports: (contactImports: {
                [id: string]: { imported: ContactImport; persisted: ContactSchema | null; import: boolean };
            }) => {
                set({ contactImports: contactImports });
            },
            removeContactImport: (contactId: string) => {
                const updatedContactImports = structuredClone(get().contactImports);
                delete updatedContactImports[contactId];
                set({ contactImports: updatedContactImports });
            },
            clearContactImports: () => {
                set({ contactImports: {} });
            },
            contactSelectionActive: false,
            setContactSelectionActive: (value: boolean) => {
                set({ contactSelectionActive: value });
            },
            // improt asssitent
            importAssistentStep: "introduction",
            previousImportAssistentStep: () => {
                const importAssistentStep = get().importAssistentStep;
                switch (importAssistentStep) {
                    case "case_import":
                        set({ importAssistentStep: "introduction" });
                        break;
                    case "case_selection":
                        set({ importAssistentStep: "case_import", caseImports: {} });
                        break;
                    case "sequence_introduction":
                        set({ importAssistentStep: "case_import" });
                        break;
                    case "sequence_import":
                        set({ importAssistentStep: "sequence_introduction" });
                        break;
                    case "sequence_analysis":
                        set({ importAssistentStep: "case_import" });
                        break;
                    case "contact_import":
                        set({
                            importAssistentStep:
                                get().sequenceAnalysisRunning || get().distanceCalculationRunning
                                    ? "sequence_analysis"
                                    : "sequence_import",
                        });
                        break;
                    case "contact_selection":
                        set({
                            importAssistentStep: "contact_import",
                            contactImports: {},
                        });
                        break;
                    default:
                        set({ importAssistentStep: "introduction" });
                }
            },
            nextImportAssistentStep: () => {
                const importAssistentStep = get().importAssistentStep;
                switch (importAssistentStep) {
                    case "introduction":
                        set({ importAssistentStep: "case_import" });
                        break;
                    case "case_import":
                        if (Object.keys(get().caseImports).length === 0) {
                            set({ importAssistentStep: "sequence_introduction" });
                            break;
                        }
                        set({ importAssistentStep: "case_selection" });
                        break;
                    case "case_selection":
                        set({ importAssistentStep: "sequence_introduction" });
                        break;
                    case "sequence_introduction":
                        set({ importAssistentStep: "sequence_import" });
                        break;
                    case "sequence_import":
                        if (Object.keys(get().sequenceImports).length === 0) {
                            set({ importAssistentStep: "contact_import" });
                            break;
                        }
                        set({ importAssistentStep: "sequence_analysis" });
                        break;
                    case "sequence_analysis":
                        set({ importAssistentStep: "contact_import" });
                        break;
                    case "contact_import":
                        if (Object.keys(get().contactImports).length === 0) {
                            set({ importAssistentStep: "conclusion" });
                            break;
                        }
                        set({ importAssistentStep: "contact_selection" });
                        break;
                    default:
                        set({ importAssistentStep: "introduction", showImportAssistent: false });
                }
            },
            showImportAssistent: false,
            setShowImportAssistent: (value: boolean) => {
                set({ showImportAssistent: value });
            },
            resetImportAssistent: (triggerSuccessToast: boolean = false) => {
                set({ showImportAssistent: false, importAssistentStep: "introduction" });
                if (triggerSuccessToast) {
                    toast({
                        title: "Herzlichen Glückwunsch!",
                        description: "Ihr Import war erfolgreich.",
                        duration: 5000,
                        variant: "success",
                    });
                }
            },
            // sequence mapping
            sequenceMappingDialogCase: null,
            initSequenceMappingDialog: (focusedCase: CaseWithRelationships) => {
                set({ sequenceMappingDialogCase: focusedCase });
            },
            hideSequenceMappingDialog: () => {
                set({ sequenceMappingDialogCase: null });
            },
            // database operations
            indexedDbTtlIsEnabled: true,
            setIndexedDbTtlIsEnabled: (isEnabled: boolean) => {
                set({ indexedDbTtlIsEnabled: isEnabled });
            },
            indexedDbExpiresAt: undefined,
            setIndexedDbExpiresAt: (hours) => {
                const TTLinMilliseconds = hours * 60 * 60 * 1000;
                const expiryDate = Date.now() + TTLinMilliseconds;
                set({ indexedDbExpiresAt: expiryDate });
            },
            deleteIndexedDbOnExit: false,
            setDeleteIndexedDbOnExit: (isActive) => {
                set({ deleteIndexedDbOnExit: isActive });
            },
            selectedDB: undefined,
            setSelectedDB: (db) => {
                set({ selectedDB: db });
            },
        }),
        {
            name: "database",
            partialize: (state) => ({
                selectedDB: state.selectedDB,
                indexedDbExpiresAt: state.indexedDbExpiresAt,
                deleteIndexedDbOnExit: state.deleteIndexedDbOnExit,
            }),
        }
    )
);
