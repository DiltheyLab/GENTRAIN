import { toast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { t } from "i18next";
import { ZodError } from "zod";

export const getToastDescription = (error: GentrainException | ZodError | Error, category = "upload") => {
    let description = null;
    if (error instanceof GentrainException) {
        description = t(`error:${category}.${error.message}`, { data: error.data ? error.data.join(", ") : [] });
    } else if (error instanceof ZodError) {
        description = t(`error:${category}.${error.message}`);
    }
    return description;
};

export const handleOutbreakAnalysisError = (error: any) => {
    if (error instanceof GentrainException || error instanceof ZodError || error instanceof Error) {
        toast({
            title: t([`error:outbreakAnalysis.title`]),
            description:
                getToastDescription(error, "outbreakAnalysis") ??
                "Bitte laden Sie die Seite neu und versuchen Sie es erneut.",
            duration: 10000,
            variant: "destructive",
        });
        console.log(error, error.message);
        return;
    }
    console.error("Error while saving analysis", error);
};

export const handleOutbreakError = (error: any) => {
    if (error instanceof GentrainException || error instanceof ZodError || error instanceof Error) {
        toast({
            title: t([`error:outbreak.title`]),
            description:
                getToastDescription(error, "outbreak") ?? "Bitte laden Sie die Seite neu und versuchen Sie es erneut.",
            duration: 10000,
            variant: "destructive",
        });
        console.log(error, error.message);
        return;
    }
    console.error("Error while saving analysis", error);
};
