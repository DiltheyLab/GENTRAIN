import { create } from "zustand";
import { CaseImport, CaseSchema } from "@/modules/core/models/cases";
import { SampleImport } from "@/modules/core/models/samples";
import { ContactImport } from "@/modules/core/models/contacts";

export interface DataManagementState {
    // case import
    caseUploads: { [caseId: string]: CaseImport };
    changeCaseUpload: (key: string, value: any) => void;
    removeCaseUpload: (key: string) => void;
    changeCaseUploads: (caseUploads: { [caseId: string]: CaseImport }) => void;
    clearCaseUploads: () => void;
    existingCases: { [caseId: string]: { existingCase: CaseSchema; caseUpload: CaseImport } };
    addExistingCase: (caseId: string, existingCase: CaseSchema, caseUpload: CaseImport) => void;
    changeExistingCase: (key: string, value: any) => void;
    clearExistingCases: () => void;
    caseSelectionActive: boolean;
    setCaseSelectionActive: (value: boolean) => void;

    // sample import
    sampleUploads: { [fastaId: string]: SampleImport };
    changeSampleUpload: (key: string, value: any) => void;
    removeSampleUpload: (key: string) => void;
    clearSampleUploads: () => void;
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
    contactUploads: { [contactId: string]: ContactImport };
    changeContactUpload: (key: string, value: any) => void;
    removeContactUpload: (key: string) => void;
    changeContactUploads: (contactUploads: { [contactId: string]: ContactImport }) => void;
    clearContactUploads: () => void;
    contactSelectionActive: boolean;
    setContactSelectionActive: (value: boolean) => void;
}

export const useDataManagementStore = create<DataManagementState>((set, get) => ({
    // case import
    caseUploads: {},
    changeCaseUpload: (caseId: string, changes: any) => {
        const updateCaseUploads = structuredClone(get().caseUploads);
        const caseUpload = { ...updateCaseUploads[caseId], ...changes };
        updateCaseUploads[caseId] = caseUpload;
        set({ caseUploads: updateCaseUploads });
    },
    removeCaseUpload: (caseId: string) => {
        const updateCaseUploads = structuredClone(get().caseUploads);
        delete updateCaseUploads[caseId];
        set({ caseUploads: updateCaseUploads });
    },
    changeCaseUploads: (caseUploads: { [caseId: string]: CaseImport }) => {
        set({ caseUploads: caseUploads });
    },
    clearCaseUploads: () => {
        set({ caseUploads: {} });
    },
    existingCases: {},
    addExistingCase: (caseId: string, existingCase: CaseSchema, caseUpload: CaseImport) => {
        const updateExistingCases = structuredClone(get().existingCases);
        updateExistingCases[caseId] = { existingCase: existingCase, caseUpload: caseUpload };
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
    sampleUploads: {},
    changeSampleUpload: (fastaId: string, changes: any) => {
        const updatedSampleUploads = structuredClone(get().sampleUploads);
        const sampleUpload = { ...updatedSampleUploads[fastaId], ...changes };
        updatedSampleUploads[fastaId] = sampleUpload;
        set({ sampleUploads: updatedSampleUploads });
    },
    removeSampleUpload: (fastaId: string) => {
        const updatedSampleUploads = structuredClone(get().sampleUploads);
        delete updatedSampleUploads[fastaId];
        set({ sampleUploads: updatedSampleUploads });
    },
    clearSampleUploads: () => {
        set({ sampleUploads: {} });
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
            sampleUploads: {},
        });
    },
    // contact import
    contactUploads: {},
    changeContactUpload: (contactId: string, changes: any) => {
        const updatedContactUploads = structuredClone(get().contactUploads);
        const contactUpload = { ...updatedContactUploads[contactId], ...changes };
        updatedContactUploads[contactId] = contactUpload;
        set({ contactUploads: updatedContactUploads });
    },
    removeContactUpload: (contactId: string) => {
        const updatedContactUploads = structuredClone(get().contactUploads);
        delete updatedContactUploads[contactId];
        set({ contactUploads: updatedContactUploads });
    },
    changeContactUploads: (contactUploads: { [contactId: string]: ContactImport }) => {
        set({ contactUploads: contactUploads });
    },
    clearContactUploads: () => {
        set({ contactUploads: {} });
    },
    contactSelectionActive: false,
    setContactSelectionActive: (value: boolean) => {
        set({ contactSelectionActive: value });
    },
}));
