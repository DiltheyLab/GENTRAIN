import { create } from "zustand";
import { CaseUpload } from "../services/data_upload/validation/CasesValidation";
import { SampleUpload } from "../services/data_upload/validation/SamplesValidation";
import { ContactUpload } from "../services/data_upload/validation/ContactsValidation";

export interface DataManagementState {
    isUploading: boolean;
    distanceCalculationCount: number;
    distanceCalculationSum: number;
    alreadyExistingCases: { [caseId: string]: CaseUpload };
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
    addAlreadyExistingCases: (key: string, value: CaseUpload) => void;
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
    alreadyExistingCases: {},
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
    removeCaseUpload: (caseId: string) => {
        const updateCaseUploads = structuredClone(get().caseUploads);
        delete updateCaseUploads[caseId];
        set({ caseUploads: updateCaseUploads });
    },
    addAlreadyExistingCases: (caseId: string, caseUpload: CaseUpload) => {
        const updateCaseUploads = get().caseUploads;
        updateCaseUploads[caseId] = caseUpload;
        set({ caseUploads: updateCaseUploads });
    },
    changeCaseUpload: (caseId: string, changes: any) => {
        const updateCaseUploads = structuredClone(get().caseUploads);
        const caseUpload = { ...updateCaseUploads, ...changes };
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
        const sampleUpload = { ...updatedSampleUploads, ...changes };
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
        const contactUpload = { ...updatedContactUploads, ...changes };
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
