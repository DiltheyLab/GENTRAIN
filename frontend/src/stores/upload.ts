import { create } from "zustand";

interface SampleUploadState {
    isUploading: boolean;
    distanceCalculationProgress: number;
    uploads: { [fastaId: string]: string };
    removeUpload: (key: string) => void;
    changeUpload: (key: string, value: string) => void;
    setIsUploading: (value: boolean) => void;
    setDistanceCalculationProgress: (progress: number) => void;
    reset: () => void;
}

export const useSampleUploadStore = create<SampleUploadState>((set, get) => ({
    isUploading: false,
    pendingUploads: [],
    failedUploads: [],
    finishedUploads: [],
    distanceCalculationProgress: 0,
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
            distanceCalculationProgress: 0,
            isUploading: false,
            uploads: {},
        });
    },
    setDistanceCalculationProgress: (progress: number) => {
        set({ distanceCalculationProgress: progress });
    },
    setIsUploading: (value: boolean) => {
        set({ isUploading: value });
    },
}));
