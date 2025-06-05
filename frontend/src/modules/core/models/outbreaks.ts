import { z } from "zod";
import { db } from "@/modules/core/services/database/DatabaseManager";

export interface OutbreakSchema {
    id: number;
    name: string;
    pathogen_id?: number;
    case_count?: number | null;
    sequenced_case_count?: number | null;
    created_at?: Date;
    updated_at?: Date;
}

export const outbreakRules = z.object({
    name: z.string().min(1),
    pathogen_id: z.number(),
});

export const getOutbreaksForPathogenId = async (pathogenId: number) => {
    const outbreaksForPathogen = await db.outbreaks
        .where({ pathogen_id: pathogenId })
        .toArray()
        .then((outbreaks) => outbreaks.sort((a, b) => a.name.localeCompare(b.name)));
    return outbreaksForPathogen;
};

export const getOutbreaksWithCaseCountForPathogenId = async (pathogenId: number) => {
    const outbreaksForPathogen = await db.outbreaks
        .where({ pathogen_id: pathogenId })
        .toArray()
        .then((outbreaks) => outbreaks.sort((a, b) => a.name.localeCompare(b.name)));

    for (const outbreak of outbreaksForPathogen) {
        outbreak.case_count = await getOutbreakCaseCount(outbreak.id);
        outbreak.sequenced_case_count = await getOutbreakSequencedCaseCount(outbreak.id);
    }

    return outbreaksForPathogen;
};

export const getOutbreakCaseCount = async (outbreakId: number) => {
    const caseCount = await db.cases.where({ outbreak_id: outbreakId }).count();
    return caseCount;
};

export const getOutbreakSequencedCaseCount = async (outbreakId: number) => {
    const caseCount = await db.cases
        .where("outbreak_id")
        .equals(outbreakId)
        .and((currentCase) => currentCase.fasta_id !== null)
        .count();
    return caseCount;
};

export const deleteOutbreaksByPathogenId = async (pathogen_id: number) => {
    await db.outbreaks.where({ pathogen_id: pathogen_id }).delete();
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
        .where("[name+pathogen_id]")
        .equals([outbreakName, pathogenId])
        .first();
    const outbreakId = existingOutbreakForNameAndPathogen
        ? existingOutbreakForNameAndPathogen.id
        : await createOutbreak(outbreakName, pathogenId);
    return outbreakId;
};

export const createOutbreak = async (name: string, pathogenId: number) => {
    const data = {
        name: name,
        pathogen_id: pathogenId,
    } as OutbreakSchema;

    // Validate the data and throw an error if it is invalid
    const dto = outbreakRules.parse(data) as OutbreakSchema;
    const outbreakId = await db.outbreaks.add(dto);
    return outbreakId;
};

export const updateOutbreakName = async (id: number, name: string) => {
    return await db.outbreaks.update(id, {
        name: name,
    });
};

export const getOutbreakMapForPathogenId = async (pathogenId: number) => {
    const outbreaks = await db.outbreaks.where({ pathogen_id: pathogenId }).toArray();
    const outbreakMap = new Map<number, OutbreakSchema>();
    for (const outbreak of outbreaks) {
        outbreakMap.set(outbreak.id, outbreak);
    }
    return outbreakMap;
};
