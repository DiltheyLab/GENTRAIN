import { create } from "zustand";

export interface DataManagementState {
    isUploading: boolean;
    distanceCalculationCount: number;
    distanceCalculationSum: number;
    uploads: { [fastaId: string]: string };
    showSampleUploadStatus: boolean;
    hideSampleUploadContent: boolean;
    sampleSelectionActive: boolean;
    sequenceAnalysisRunning: boolean;
    distanceCalculationRunning: boolean;
    setSampleSelectionActive: (value: boolean) => void;
    setSequenceAnalysisRunning: (value: boolean) => void;
    setdistanceCalculationRunning: (value: boolean) => void;
    setShowSampleUploadStatus: (value: boolean) => void;
    setHideSampleUploadContent: (value: boolean) => void;
    removeUpload: (key: string) => void;
    changeUpload: (key: string, value: string) => void;
    setIsUploading: (value: boolean) => void;
    incrementDistanceCalculationCount: () => void;
    setDistanceCalculationSum: (sum: number) => void;
    resetSampleUpload: () => void;
}

export const useDataManagementStore = create<DataManagementState>((set, get) => ({
    isUploading: false,
    distanceCalculationCount: 0,
    distanceCalculationSum: 0,
    removedSamples: [],
    uploads: {},
    showSampleUploadStatus: false,
    hideSampleUploadContent: false,
    sequenceAnalysisRunning: false,
    distanceCalculationRunning: false,
    sampleSelectionActive: false,
    setSampleSelectionActive: (value: boolean) => {
        set({ sampleSelectionActive: value });
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
    removeUpload: (fastaId: string) => {
        const updatedUploads = get().uploads;
        delete updatedUploads[fastaId];
        set({ uploads: updatedUploads });
    },
    changeUpload: (fastaId: string, status: string) => {
        const updatedUploads = get().uploads;
        updatedUploads[fastaId] = status;
        set({ uploads: updatedUploads });
    },
    resetSampleUpload: () => {
        set({
            distanceCalculationCount: 0,
            distanceCalculationSum: 0,
            isUploading: false,
            showSampleUploadStatus: false,
            uploads: {},
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
