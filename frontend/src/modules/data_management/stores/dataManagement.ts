import { create } from "zustand";

export interface DataManagementState {
    isUploading: boolean;
    distanceCalculationCount: number;
    distanceCalculationSum: number;
    uploads: { [fastaId: string]: string };
    showSampleUploadStatus: boolean;
    setShowSampleUploadStatus: (value: boolean) => void;
    removeUpload: (key: string) => void;
    changeUpload: (key: string, value: string) => void;
    setIsUploading: (value: boolean) => void;
    incrementDistanceCalculationCount: () => void;
    setDistanceCalculationSum: (sum: number) => void;
    reset: () => void;
}

export const useDataManagementStore = create<DataManagementState>((set, get) => ({
    isUploading: false,
    distanceCalculationCount: 0,
    distanceCalculationSum: 0,
    removedSamples: [],
    uploads: {},
    showSampleUploadStatus: false,
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
    reset: () => {
        set({
            distanceCalculationCount: 0,
            distanceCalculationSum: 0,
            isUploading: false,
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
