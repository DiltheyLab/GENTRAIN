import { GentrainException } from "@/exceptions/GentrainException";
import { t } from "i18next";
import { ZodError } from "zod";

export const getToastDescription = (error: GentrainException | ZodError | Error) => {
    let description = null;
    if (error instanceof GentrainException) {
        description = t(`error:upload.${error.message}`, { data: error.data ? error.data.join(", ") : [] });
    } else if (error instanceof ZodError) {
        description = t(`error:upload.${error.message}`);
    }
    return description;
};
