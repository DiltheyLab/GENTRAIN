import { DataUploadFactory } from "./DataUploadFactory";

export class SampleMappingUpload extends DataUploadFactory {
    persistSamples() {
        console.log("Persist Samples for Bacteria Upload.");
    }
}
