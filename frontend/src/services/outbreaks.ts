import { db } from "@/database/db";
import { outbreakRules, OutbreakSchema } from "@/database/outbreak";

const createOutbreak = async (name: string) => {
    const data = {
        name: name,
    } as OutbreakSchema;

    // Validate the data and throw an error if it is invalid
    const dto = outbreakRules.parse(data) as OutbreakSchema;
    const outbreakId = await db.outbreaks.add(dto);
    return outbreakId;
};

/**
 * Persists a outbreak in the database if it does not exist. Returns the corresponding id.
 *
 * @param categoryName
 * @returns
 */
export const getOrPersistOutbreak = async (outbreakName: string) => {
    if (outbreakName.length === 0) {
        return null;
    }
    const existingOutbreakForName = await db.outbreaks.where({ name: outbreakName }).first();
    const outbreakId = existingOutbreakForName ? existingOutbreakForName.id : await createOutbreak(outbreakName);
    return outbreakId;
};
