import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/infrastructure/database";
import { ValidationStrategy } from "./ValidationStrategy";
import { SampleImport, SampleSchema } from "@/modules/core/models/samples";
import { PathogenStrategyManager } from "../../pathogen_strategies/PathogenStrategyManager";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { toast } from "@/modules/core/components/ui/UseToast";
import { useCoreStore } from "@/modules/core/stores/core";

export class SamplesValidation extends ValidationStrategy {
    protected data: { fastaId: string; sequence: string }[] = [];

    public collectData(data: { fastaId: string; sequence: string }[]) {
        this.data = data;
    }

    protected validate = async () => {
        const samplesWithoutCase: string[] = [];
        const activePathogen = useCoreStore.getState().activePathogen;
        const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();

        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        const sampleImports: {
            [id: string]: {
                imported: SampleImport;
                persisted: SampleSchema | null;
                import: boolean;
                status: string;
            };
        } = {};
        for (const sample of this.data) {
            // only import if case for the pathogen and a samples with the same fasta id does not already exist
            const sampleCase = await db.cases
                .where("[fasta_id+pathogen_id]")
                .equals([sample.fastaId, activePathogen.id])
                .first();
            const existingSample = await db.samples.where({ fasta_id: sample.fastaId }).first();

            if (!sampleCase || existingSample) {
                samplesWithoutCase.push(sample.fastaId);
            } else {
                sampleImports[sample.fastaId] = {
                    imported: {
                        ...{
                            case_id: sampleCase.case_id,
                            sequence: sample.sequence,
                        },
                        ...sequenceAnalysisStrategy?.getQualityParameters(sample.sequence),
                    } satisfies SampleImport,
                    persisted: null,
                    import: true,
                    status: "sent",
                };
            }
        }

        useDataManagementStore.getState().setSampleImports(sampleImports);

        if (this.data.length > 0) {
            useDataManagementStore.getState().setSampleSelectionActive(true);
        }

        if (Object.keys(sampleImports).length === 0) {
            toast({
                title: "Die ausgewählte Datei enthält keine neuen Sequenzen.",
                duration: 5000,
                variant: "default",
            });
        } else {
            if (useDataManagementStore.getState().showImportAssistent) {
                useDataManagementStore.getState().nextImportAssistentStep();
            }
        }

        return {
            data: this.data,
        };
    };
}
