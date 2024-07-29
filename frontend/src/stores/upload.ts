import { create } from "zustand";

interface SampleUploadState {
    isUploading: boolean;
    pendingUploads: string[];
    failedUploads: string[];
    finishedUploads: string[];
    distanceCalculationProgress: number;
    removedSamples: string[];
    addFailedUpload: (fastaId: string) => void;
    addPendingUpload: (fastaId: string) => void;
    setIsUploading: (value: boolean) => void;
    addFinishedUpload: (fastaId: string) => void;
    setDistanceCalculationProgress: (progress: number) => void;
    reset: () => void;
    addToRemovedSamples: (fastaId: string) => void;
}

export const useSampleUploadStore = create<SampleUploadState>((set, get) => ({
    isUploading: false,
    pendingUploads: [],
    failedUploads: [],
    finishedUploads: [],
    distanceCalculationProgress: 0,
    removedSamples: [],
    addToRemovedSamples: (removedId: string) => {
        const updatedPendingUploads = get().pendingUploads.filter((fastaId) => fastaId !== removedId);
        const updatedRemovedSamples = get().removedSamples;
        updatedRemovedSamples.push(removedId);
        set({ pendingUploads: updatedPendingUploads });
        set({ removedSamples: updatedRemovedSamples });
    },
    reset: () => {
        set({
            distanceCalculationProgress: 0,
            isUploading: false,
            pendingUploads: [],
            finishedUploads: [],
            failedUploads: [],
            removedSamples: [],
        });
    },
    setDistanceCalculationProgress: (progress: number) => {
        set({ distanceCalculationProgress: progress });
    },
    setIsUploading: (value: boolean) => {
        set({ isUploading: value });
    },
    addFailedUpload: (fastaId: string) => {
        const updatedPendingUploads = get().pendingUploads.filter((pendingId) => pendingId !== fastaId);
        const updatedFailedUploads = get().failedUploads;
        updatedFailedUploads.push(fastaId);
        set({ pendingUploads: updatedPendingUploads.sort() });
        set({ failedUploads: updatedFailedUploads.sort() });
    },
    addPendingUpload: (fastaId: string) => {
        const updatedPendingUploads = get().pendingUploads;
        updatedPendingUploads.push(fastaId);
        set({ pendingUploads: updatedPendingUploads.sort() });
    },
    addFinishedUpload: (fastaId: string) => {
        const updatedPendingUploads = get().pendingUploads.filter((pendingId) => pendingId !== fastaId);
        const updatedFinishedUploads = get().finishedUploads;
        updatedFinishedUploads.push(fastaId);
        set({ pendingUploads: updatedPendingUploads.sort() });
        set({ finishedUploads: updatedFinishedUploads.sort() });
    },
}));
