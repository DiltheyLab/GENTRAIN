import { DataUploadFactory } from "./DataUploadFactory";

export class SampleMappingUpload extends DataUploadFactory {
    validateCsv() {
        console.log("Validate CSV for Sample Mapping Upload.");
    }
    persistSamples() {
        console.log("Persist Samples for Sample Mapping Upload.");
    }
}
