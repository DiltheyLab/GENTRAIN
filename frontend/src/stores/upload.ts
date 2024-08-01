import { create } from "zustand";

export interface SampleUploadState {
    isUploading: boolean;
    distanceCalculationCount: number;
    distanceCalculationSum: number;
    uploads: { [fastaId: string]: string };
    removeUpload: (key: string) => void;
    changeUpload: (key: string, value: string) => void;
    setIsUploading: (value: boolean) => void;
    incrementDistanceCalculationCount: () => void;
    setDistanceCalculationSum: (sum: number) => void;
    reset: () => void;
}

export const useSampleUploadStore = create<SampleUploadState>((set, get) => ({
    isUploading: false,
    pendingUploads: [],
    failedUploads: [],
    finishedUploads: [],
    distanceCalculationCount: 0,
    distanceCalculationSum: 0,
    removedSamples: [],
    uploads: {},
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
