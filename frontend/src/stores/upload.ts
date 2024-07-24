import { create } from "zustand";

interface SampleUploadState {
    uploading: boolean;
    pendingUploads: string[];
    finishedUploads: string[];
    distanceCalculationProgress: number;
    removedSamples: string[];
    addPendingUpload: (fastaIds: string) => void;
    setUploading: (value: boolean) => void;
    addFinishedUpload: (fastaIds: string) => void;
    setDistanceCalculationProgress: (progress: number) => void;
    reset: () => void;
    addToRemovedSamples: (fastaId: string) => void;
}

export const useSampleUploadStore = create<SampleUploadState>((set, get) => ({
    uploading: false,
    pendingUploads: [],
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
            uploading: false,
            pendingUploads: [],
            finishedUploads: [],
            removedSamples: [],
        });
    },
    setDistanceCalculationProgress: (progress: number) => {
        set({ distanceCalculationProgress: progress });
    },
    setUploading: (value: boolean) => {
        set({ uploading: value });
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
