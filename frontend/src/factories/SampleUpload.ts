import { DataUploadFactory } from "./DataUploadFactory";

export class SampleUpload extends DataUploadFactory {
    validateCsv() {
        console.log("Validate CSV for Sample Upload.");
    }
    persistSamples() {
        console.log("Persist Samples for Sample Upload.");
    }
}
