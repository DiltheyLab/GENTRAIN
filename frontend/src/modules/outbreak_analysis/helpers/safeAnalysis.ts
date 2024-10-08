import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { handleOutbreakAnalysisError } from "@/modules/core/helpers/errors";
import { updateAnalysisSettings } from "@/modules/core/models/analyses";
import { OutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { toast } from "@/modules/core/components/ui/UseToast";

export const safeAnalysis = async (outbreakAnalysisStore: OutbreakAnalysisStore, enableSuccessToast = true) => {
    try {
        if (!outbreakAnalysisStore.id) throw new GentrainException("AnalysisIdIsNotInStore");
        const analysisId = await updateAnalysisSettings(
            outbreakAnalysisStore.id,
            outbreakAnalysisStore.analysisSettings,
            outbreakAnalysisStore.graphSettings,
            outbreakAnalysisStore.generalSettings
        );

        if (!analysisId) {
            throw new GentrainException("AnalysisIdIsNotInDB");
        }

        if (enableSuccessToast) {
            toast({
                title: "Analyse gespeichert",
                description: "Die Analyse wurde erfolgreich gespeichert.",
                duration: 5000,
            });
        }
        return true;
    } catch (error) {
        handleOutbreakAnalysisError(error);
        return false;
    }
};
