import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/infrastructure/database";
import { DataManagementState, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ValidationStrategy } from "./ValidationStrategy";
export class SamplesValidation extends ValidationStrategy {
    protected dataManagementState: DataManagementState;
    constructor() {
        super();
        this.dataManagementState = useDataManagementStore.getState();
    }
    protected validate = async (data: { fastaId: string; sequence: string }[]) => {
        const samplesWithoutCase: string[] = [];
        const activePathogen = this.coreState.activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        for (const sample of data) {
            // only import if case for the pathogen and a samples with the same fasta id does not already exist
            const sampleCase = await db.cases
                .where("[fasta_id+pathogen_id]")
                .equals([sample.fastaId, activePathogen.id])
                .first();
            const existingSample = await db.samples.where({ fasta_id: sample.fastaId }).first();
            if (!sampleCase || existingSample) {
                samplesWithoutCase.push(sample.fastaId);
            } else {
                useDataManagementStore.getState().changeUpload(sample.fastaId, "pending");
            }
        }

        // get only samples which were not marked as a sample without a case
        data = data.filter(function (sample) {
            return !samplesWithoutCase.includes(sample.fastaId);
        });

        if (data.length > 0) {
            this.dataManagementState.setSampleSelectionActive(true);
        }
        return {
            data: data,
            warnings:
                samplesWithoutCase.length > 0
                    ? [
                          {
                              title: "Folgende Sequenzen existieren bereits oder konnten keinem existierenden Fall zugeordnet werden.",
                              description: samplesWithoutCase.join(", "),
                          },
                      ]
                    : [],
        };
    };
}
