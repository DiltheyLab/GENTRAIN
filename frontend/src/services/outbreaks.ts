import { db } from "@/database/db";
import { outbreakRules, OutbreakSchema } from "@/database/outbreak";

const createOutbreak = async (name: string, pathogenId: number) => {
    const data = {
        name: name,
        pathogen_id: pathogenId,
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
export const getOrPersistOutbreak = async (outbreakName: string, pathogenId: number) => {
    if (!outbreakName) {
        return;
    }
    const existingOutbreakForNameAndPathogen = await db.outbreaks
        .where({ name: outbreakName, pathogen_id: pathogenId })
        .first();
    const outbreakId = existingOutbreakForNameAndPathogen
        ? existingOutbreakForNameAndPathogen.id
        : await createOutbreak(outbreakName, pathogenId);
    return outbreakId;
};
