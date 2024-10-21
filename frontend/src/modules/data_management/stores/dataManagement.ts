import { create } from "zustand";
import { CaseImport, CaseSchema } from "@/modules/core/models/cases";
import { SampleImport, SampleSchema } from "@/modules/core/models/samples";
import { ContactImport, ContactSchema } from "@/modules/core/models/contacts";

export interface DataManagementState {
    clearImports: () => void;
    // case import
    caseImports: {
        [id: string]: {
            imported: CaseImport;
            persisted: CaseSchema | null;
            import: boolean;
        };
    };
    changeCaseImport: (key: string, value: any) => void;
    removeCaseImport: (key: string) => void;
    setCaseImports: (caseImports: {
        [id: string]: { imported: CaseImport; persisted: CaseSchema | null; import: boolean };
    }) => void;
    clearCaseImports: () => void;
    caseSelectionActive: boolean;
    setCaseSelectionActive: (value: boolean) => void;
    // sample import
    sampleImports: {
        [id: string]: { imported: SampleImport; persisted: SampleSchema | null; import: boolean; status: string };
    };
    changeSampleImport: (key: string, value: any) => void;
    removeSampleImport: (key: string) => void;
    setSampleImports: (imports: {
        [id: string]: { imported: SampleImport; persisted: SampleSchema | null; import: boolean; status: string };
    }) => void;
    clearSampleImports: () => void;
    sampleSelectionActive: boolean;
    setSampleSelectionActive: (value: boolean) => void;
    showSampleUploadStatus: boolean;
    setShowSampleUploadStatus: (value: boolean) => void;
    hideSampleUploadContent: boolean;
    setHideSampleUploadContent: (value: boolean) => void;
    sequenceAnalysisRunning: boolean;
    setSequenceAnalysisRunning: (value: boolean) => void;
    distanceCalculationRunning: boolean;
    setDistanceCalculationRunning: (value: boolean) => void;
    isUploading: boolean;
    setIsUploading: (value: boolean) => void;
    distanceCalculationCount: number;
    incrementDistanceCalculationCount: () => void;
    distanceCalculationSum: number;
    setDistanceCalculationSum: (sum: number) => void;
    resetSampleUpload: () => void;
    // contact import
    contactImports: { [id: string]: { imported: ContactImport; persisted: ContactSchema | null; import: boolean } };
    changeContactImport: (key: string, value: any) => void;
    removeContactImport: (key: string) => void;
    setContactImports: (contactImports: {
        [id: string]: { imported: ContactImport; persisted: ContactSchema | null; import: boolean };
    }) => void;
    clearContactImports: () => void;
    contactSelectionActive: boolean;
    setContactSelectionActive: (value: boolean) => void;
    // initial upload modal
    initialUploadStep: string | null;
    previousInitialUploadStep: () => void;
    nextInitialUploadStep: () => void;
    showInitialUpload: boolean;
    setShowInitialUpload: (value: boolean) => void;
    resetInitialUpload: () => void;
}

export const useDataManagementStore = create<DataManagementState>((set, get) => ({
    clearImports: () => {
        set({ caseImports: {}, sampleImports: {}, contactImports: {} });
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
    caseSelectionActive: false,
    setCaseSelectionActive: (value: boolean) => {
        set({ caseSelectionActive: value });
    },
    // sample import
    sampleImports: {},
    changeSampleImport: (fastaId: string, changes: any) => {
        const updatedSampleImports = structuredClone(get().sampleImports);
        const sampleImport = { ...updatedSampleImports[fastaId], ...changes };
        updatedSampleImports[fastaId] = sampleImport;
        set({ sampleImports: updatedSampleImports });
    },
    setSampleImports: (imports: {
        [id: string]: { imported: SampleImport; persisted: SampleSchema | null; import: boolean; status: string };
    }) => {
        set({ sampleImports: imports });
    },
    removeSampleImport: (fastaId: string) => {
        const updatedSampleImports = structuredClone(get().sampleImports);
        delete updatedSampleImports[fastaId];
        set({ sampleImports: updatedSampleImports });
    },
    clearSampleImports: () => {
        set({ sampleImports: {} });
    },
    sampleSelectionActive: false,
    setSampleSelectionActive: (value: boolean) => {
        set({ sampleSelectionActive: value });
    },
    showSampleUploadStatus: false,
    setShowSampleUploadStatus: (value: boolean) => {
        set({ showSampleUploadStatus: value });
    },
    hideSampleUploadContent: false,
    setHideSampleUploadContent: (value: boolean) => {
        set({ hideSampleUploadContent: value });
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
    resetSampleUpload: () => {
        set({
            distanceCalculationCount: 0,
            distanceCalculationSum: 0,
            isUploading: false,
            showSampleUploadStatus: false,
            hideSampleUploadContent: false,
            sampleImports: {},
        });
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
    // initial upload modal
    initialUploadStep: "introduction",
    previousInitialUploadStep: () => {
        const initialUploadStep = get().initialUploadStep;
        switch (initialUploadStep) {
            case "case_import":
                set({ initialUploadStep: "introduction" });
                break;
            case "case_selection":
                set({ initialUploadStep: "case_import", caseImports: {} });
                break;
            case "sequence_introduction":
                set({ initialUploadStep: "case_import" });
                break;
            case "sequence_import":
                set({ initialUploadStep: "sequence_introduction" });
                break;
            case "sequence_selection":
                set({ initialUploadStep: "sequence_import", sampleImports: {} });
                break;
            case "sequence_analysis":
                set({ initialUploadStep: "case_import" });
                break;
            case "contact_import":
                set({
                    initialUploadStep:
                        get().sequenceAnalysisRunning || get().distanceCalculationRunning
                            ? "sequence_analysis"
                            : "sequence_import",
                });
                break;
            case "contact_selection":
                set({
                    initialUploadStep: "contact_import",
                    contactImports: {},
                });
                break;
            default:
                set({ initialUploadStep: "introduction" });
        }
    },
    nextInitialUploadStep: () => {
        const initialUploadStep = get().initialUploadStep;
        switch (initialUploadStep) {
            case "introduction":
                set({ initialUploadStep: "case_import" });
                break;
            case "case_import":
                if (Object.keys(get().caseImports).length === 0) {
                    set({ initialUploadStep: "sequence_introduction" });
                    break;
                }
                set({ initialUploadStep: "case_selection" });
                break;
            case "case_selection":
                set({ initialUploadStep: "sequence_introduction" });
                break;
            case "sequence_introduction":
                set({ initialUploadStep: "sequence_import" });
                break;
            case "sequence_import":
                if (Object.keys(get().sampleImports).length === 0) {
                    set({ initialUploadStep: "contact_import" });
                    break;
                }
                set({ initialUploadStep: "sequence_selection" });
                break;
            case "sequence_selection":
                set({ initialUploadStep: "sequence_analysis" });
                break;
            case "sequence_analysis":
                set({ initialUploadStep: "contact_import" });
                break;
            case "contact_import":
                if (Object.keys(get().contactImports).length === 0) {
                    set({ initialUploadStep: "conclusion" });
                    break;
                }
                set({ initialUploadStep: "contact_selection" });
                break;
            case "contact_selection":
                set({ initialUploadStep: "conclusion" });
                break;
            default:
                set({ initialUploadStep: "introduction", showInitialUpload: false });
        }
    },
    showInitialUpload: false,
    setShowInitialUpload: (value: boolean) => {
        set({ showInitialUpload: value });
    },
    resetInitialUpload: () => {
        set({ showInitialUpload: false, initialUploadStep: "introduction" });
    },
}));
