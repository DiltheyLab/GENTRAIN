import { DataUploadFactory } from "./DataUploadFactory";

export class CaseUpload extends DataUploadFactory {
    validateCsv() {
        console.log("Validate CSV for Case Upload.");
    }
    persistSamples() {
        console.log("Persist Samples for Casew Upload.");
    }
}
