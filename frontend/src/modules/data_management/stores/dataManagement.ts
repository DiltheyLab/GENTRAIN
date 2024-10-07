import { create } from "zustand";
import { CaseUpload } from "../services/data_upload/validation/CasesValidation";
import { SampleUpload } from "../services/data_upload/validation/SamplesValidation";
import { ContactUpload } from "../services/data_upload/validation/ContactsValidation";
import { CaseSchema } from "@/modules/core/models/cases";
import { ContactSchema } from "@/modules/core/models/contacts";

export interface DataManagementState {
    isUploading: boolean;
    distanceCalculationCount: number;
    distanceCalculationSum: number;
    existingCases: { [caseId: string]: { existingCase: CaseSchema; caseUpload: CaseUpload } };
    caseUploads: { [caseId: string]: CaseUpload };
    sampleUploads: { [fastaId: string]: SampleUpload };
    contactUploads: { [contactId: string]: ContactUpload };
    showSampleUploadStatus: boolean;
    hideSampleUploadContent: boolean;
    caseSelectionActive: boolean;
    sampleSelectionActive: boolean;
    contactSelectionActive: boolean;
    sequenceAnalysisRunning: boolean;
    distanceCalculationRunning: boolean;
    setCaseSelectionActive: (value: boolean) => void;
    setSampleSelectionActive: (value: boolean) => void;
    setContactSelectionActive: (value: boolean) => void;
    setSequenceAnalysisRunning: (value: boolean) => void;
    setdistanceCalculationRunning: (value: boolean) => void;
    setShowSampleUploadStatus: (value: boolean) => void;
    setHideSampleUploadContent: (value: boolean) => void;
    removeCaseUpload: (key: string) => void;
    changeCaseUpload: (key: string, value: any) => void;
    changeExistingCase: (key: string, value: any) => void;
    addExistingCase: (caseId: string, existingCase: CaseSchema, caseUpload: CaseUpload) => void;
    clearExistingCases: () => void;
    clearCaseUploads: () => void;
    clearContactUploads: () => void;
    changeContactUploads: (contactUploads: { [contactId: string]: ContactUpload }) => void;
    removeSampleUpload: (key: string) => void;
    changeSampleUpload: (key: string, value: any) => void;
    removeContactUpload: (key: string) => void;
    changeContactUpload: (key: string, value: any) => void;
    setIsUploading: (value: boolean) => void;
    incrementDistanceCalculationCount: () => void;
    setDistanceCalculationSum: (sum: number) => void;
    resetSampleUpload: () => void;
    resetCaseUpload: () => void;
}

export const useDataManagementStore = create<DataManagementState>((set, get) => ({
    isUploading: false,
    distanceCalculationCount: 0,
    distanceCalculationSum: 0,
    removedSamples: [],
    existingCases: {},
    caseUploads: {},
    sampleUploads: {},
    contactUploads: {},
    showSampleUploadStatus: false,
    hideSampleUploadContent: false,
    sequenceAnalysisRunning: false,
    distanceCalculationRunning: false,
    caseSelectionActive: false,
    sampleSelectionActive: false,
    contactSelectionActive: false,
    setCaseSelectionActive: (value: boolean) => {
        set({ caseSelectionActive: value });
    },
    setSampleSelectionActive: (value: boolean) => {
        set({ sampleSelectionActive: value });
    },
    setContactSelectionActive: (value: boolean) => {
        set({ contactSelectionActive: value });
    },
    setSequenceAnalysisRunning: (value: boolean) => {
        set({ sequenceAnalysisRunning: value });
    },
    setdistanceCalculationRunning: (value: boolean) => {
        set({ distanceCalculationRunning: value });
    },
    setHideSampleUploadContent: (value: boolean) => {
        set({ hideSampleUploadContent: value });
    },
    setShowSampleUploadStatus: (value: boolean) => {
        set({ showSampleUploadStatus: value });
    },
    changeContactUploads: (contactUploads: { [contactId: string]: ContactUpload }) => {
        set({ contactUploads: contactUploads });
    },
    removeCaseUpload: (caseId: string) => {
        const updateCaseUploads = structuredClone(get().caseUploads);
        delete updateCaseUploads[caseId];
        set({ caseUploads: updateCaseUploads });
    },
    addExistingCase: (caseId: string, existingCase: CaseSchema, caseUpload: CaseUpload) => {
        const updateExistingCases = structuredClone(get().existingCases);
        updateExistingCases[caseId] = { existingCase: existingCase, caseUpload: caseUpload };
        set({ existingCases: updateExistingCases });
    },
    clearExistingCases: () => {
        set({ existingCases: {} });
    },
    clearCaseUploads: () => {
        set({ caseUploads: {} });
    },
    clearContactUploads: () => {
        set({ contactUploads: {} });
    },
    changeExistingCase: (caseId: string, changes: any) => {
        const updateExistingCases = structuredClone(get().existingCases);
        const caseUpdate = { ...updateExistingCases[caseId], ...changes };
        updateExistingCases[caseId] = caseUpdate;
        set({ existingCases: updateExistingCases });
    },
    changeCaseUpload: (caseId: string, changes: any) => {
        const updateCaseUploads = structuredClone(get().caseUploads);
        const caseUpload = { ...updateCaseUploads[caseId], ...changes };
        updateCaseUploads[caseId] = caseUpload;
        set({ caseUploads: updateCaseUploads });
    },
    removeSampleUpload: (fastaId: string) => {
        const updatedSampleUploads = structuredClone(get().sampleUploads);
        delete updatedSampleUploads[fastaId];
        set({ sampleUploads: updatedSampleUploads });
    },
    changeSampleUpload: (fastaId: string, changes: any) => {
        const updatedSampleUploads = structuredClone(get().sampleUploads);
        const sampleUpload = { ...updatedSampleUploads[fastaId], ...changes };
        updatedSampleUploads[fastaId] = sampleUpload;
        set({ sampleUploads: updatedSampleUploads });
    },
    removeContactUpload: (contactId: string) => {
        const updatedContactUploads = structuredClone(get().contactUploads);
        delete updatedContactUploads[contactId];
        set({ contactUploads: updatedContactUploads });
    },
    changeContactUpload: (contactId: string, changes: any) => {
        const updatedContactUploads = structuredClone(get().contactUploads);
        const contactUpload = { ...updatedContactUploads[contactId], ...changes };
        updatedContactUploads[contactId] = contactUpload;
        set({ contactUploads: updatedContactUploads });
    },
    resetCaseUpload: () => {
        set({
            caseUploads: {},
        });
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
    incrementDistanceCalculationCount: () => {
        const newCount = get().distanceCalculationCount + 1;
        set({ distanceCalculationCount: newCount });
    },
    setDistanceCalculationSum: (sum: number) => {
        set({ distanceCalculationSum: sum });
    },
    setIsUploading: (value: boolean) => {
        set({ isUploading: value });
    },
}));
