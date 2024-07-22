import { create } from "zustand";

interface UploadState {
    sampleUploads: { [fastaId: string]: string };
    addSampleUpload: (fastaId: string) => void;
    updateSampleUpload: (fastaId: string, status: string) => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
    sampleUploads: {},
    addSampleUpload: (fastaId: string) => {
        const sampleUploads = get().sampleUploads;
        sampleUploads[fastaId] = "pending";
        set({ sampleUploads: sampleUploads });
    },
    updateSampleUpload: (fastaId: string, status: string) => {
        console.log(fastaId, status);
        const sampleUploads = get().sampleUploads;
        sampleUploads[fastaId] = status;
        set({ sampleUploads: sampleUploads });
    },
}));
