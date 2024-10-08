import { create } from "zustand";
import { CaseImport, CaseSchema } from "@/modules/core/models/cases";
import { SampleImport } from "@/modules/core/models/samples";
import { ContactImport } from "@/modules/core/models/contacts";

export interface DataManagementState {
    // case import
    caseImports: { [caseId: string]: CaseImport };
    changeCaseImport: (key: string, value: any) => void;
    removeCaseImport: (key: string) => void;
    changeCaseImports: (caseImports: { [caseId: string]: CaseImport }) => void;
    clearCaseImports: () => void;
    existingCases: { [caseId: string]: { existingCase: CaseSchema; caseImport: CaseImport } };
    addExistingCase: (caseId: string, existingCase: CaseSchema, caseImport: CaseImport) => void;
    changeExistingCase: (key: string, value: any) => void;
    clearExistingCases: () => void;
    caseSelectionActive: boolean;
    setCaseSelectionActive: (value: boolean) => void;
    // sample import
    sampleImports: { [fastaId: string]: SampleImport };
    changeSampleImport: (key: string, value: any) => void;
    removeSampleImport: (key: string) => void;
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
    contactImports: { [contactId: string]: ContactImport };
    changeContactImport: (key: string, value: any) => void;
    removeContactImport: (key: string) => void;
    changeContactImports: (contactImports: { [contactId: string]: ContactImport }) => void;
    clearContactImports: () => void;
    contactSelectionActive: boolean;
    setContactSelectionActive: (value: boolean) => void;
}

export const useDataManagementStore = create<DataManagementState>((set, get) => ({
    // case import
    caseImports: {},
    changeCaseImport: (caseId: string, changes: any) => {
        const updatedCaseImports = structuredClone(get().caseImports);
        const caseImport = { ...updatedCaseImports[caseId], ...changes };
        updatedCaseImports[caseId] = caseImport;
        set({ caseImports: updatedCaseImports });
    },
    removeCaseImport: (caseId: string) => {
        const updatedCaseImports = structuredClone(get().caseImports);
        delete updatedCaseImports[caseId];
        set({ caseImports: updatedCaseImports });
    },
    changeCaseImports: (caseImports: { [caseId: string]: CaseImport }) => {
        set({ caseImports: caseImports });
    },
    clearCaseImports: () => {
        set({ caseImports: {} });
    },
    existingCases: {},
    addExistingCase: (caseId: string, existingCase: CaseSchema, caseImport: CaseImport) => {
        const updateExistingCases = structuredClone(get().existingCases);
        updateExistingCases[caseId] = { existingCase: existingCase, caseImport: caseImport };
        set({ existingCases: updateExistingCases });
    },
    changeExistingCase: (caseId: string, changes: any) => {
        const updateExistingCases = structuredClone(get().existingCases);
        const caseUpdate = { ...updateExistingCases[caseId], ...changes };
        updateExistingCases[caseId] = caseUpdate;
        set({ existingCases: updateExistingCases });
    },
    clearExistingCases: () => {
        set({ existingCases: {} });
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
    removeContactImport: (contactId: string) => {
        const updatedContactImports = structuredClone(get().contactImports);
        delete updatedContactImports[contactId];
        set({ contactImports: updatedContactImports });
    },
    changeContactImports: (contactImports: { [contactId: string]: ContactImport }) => {
        set({ contactImports: contactImports });
    },
    clearContactImports: () => {
        set({ contactImports: {} });
    },
    contactSelectionActive: false,
    setContactSelectionActive: (value: boolean) => {
        set({ contactSelectionActive: value });
    },
}));
