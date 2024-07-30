import { Button } from "../ui/button";
import { useAnalysisStore } from "@/stores/analysis";
import { updateAnalysisSettings } from "@/database/analyses";
import { toast } from "../ui/use-toast";
import { OutbreakSelection } from "./OutbreakSelection";
import { GentrainException } from "@/exceptions/GentrainException";
import { handleError } from "@/services/errors";
import { BackgroundSelection } from "./BackgroundSelection";

export const AnalysisSettings = () => {
    const analysisStore = useAnalysisStore();

    const safeAnalysis = async () => {
        try {
            if (!analysisStore.id) throw new GentrainException("AnalysisIdIsNotInStore");
            const success = await updateAnalysisSettings(analysisStore.id, analysisStore.settings);
            if (success) {
                toast({
                    title: "Analyse gespeichert",
                    description: "Die Analyse wurde erfolgreich gespeichert.",
                    duration: 5000,
                });
            } else {
                throw new GentrainException("AnalysisIdIsNotInDB");
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="relative flex-col items-center gap-8 flex min-h-[80vh]" x-chunk="dashboard-03-chunk-0">
            <form className="w-full items-start gap-3">
                <fieldset className="flex flex-col gap-6 rounded-lg border p-4 ">
                    <div className="flex flex-col gap-3">
                        <OutbreakSelection />
                        {analysisStore.settings.selectedOutbreak && (
                            <>
                                <BackgroundSelection />
                                <Button type="button" onClick={() => safeAnalysis()}>
                                    Analyse speichern
                                </Button>
                            </>
                        )}
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
