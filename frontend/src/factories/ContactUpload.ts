import { DataUploadFactory } from "./DataUploadFactory";

export class ContactUpload extends DataUploadFactory {
    validateCsv() {
        console.log("Validate CSV for Contact Upload.");
    }
    persistSamples() {
        console.log("Persist Samples for Contact Upload.");
    }
}
