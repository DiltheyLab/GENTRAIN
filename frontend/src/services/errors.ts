import { toast } from "@/components/ui/use-toast";
import { GentrainException } from "@/exceptions/GentrainException";
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

export const handleError = (error: any) => {
    if (error instanceof GentrainException || error instanceof ZodError || error instanceof Error) {
        toast({
            title: t([`error:outbreakAnalysis.title`]),
            description: getToastDescription(error, "outbreakAnalysis"),
            duration: 10000,
            variant: "destructive",
        });
        console.log(error, error.message);
        return;
    }
    console.error("Error while saving analysis", error);
};
