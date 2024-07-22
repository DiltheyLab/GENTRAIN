import { create } from "zustand";

interface SampleUploadState {
    uploading: boolean;
    pendingUploads: string[];
    finishedUploads: string[];
    addPendingUpload: (fastaIds: string) => void;
    setUploading: (value: boolean) => void;
    addFinishedUpload: (fastaIds: string) => void;
}

export const useSampleUploadStore = create<SampleUploadState>((set, get) => ({
    uploading: false,
    pendingUploads: [],
    finishedUploads: [],
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
