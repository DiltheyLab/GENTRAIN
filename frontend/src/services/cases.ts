import { deleteCaseById, getCaseWithSampleById } from "@/database/cases";
import { db } from "@/database/db";
import { getOrCreateDistanceMatrixByPathogenId } from "@/database/distance_matrices";
import { deleteDistancesBySampleId } from "@/database/distances";
import { deleteSampleById } from "@/database/samples";
import { useAppStore } from "@/stores/app";

export const deleteCasebyIdAndRecalculateDistances = async (id: number) => {
    const activePathogen = useAppStore.getState().activePathogen;
    if (activePathogen) {
        await db.transaction("rw", db.cases, db.samples, db.distances, db.distance_matrices, async () => {
            const distanceMatrixId = await getOrCreateDistanceMatrixByPathogenId(activePathogen.id);
            const caseWithSample = await getCaseWithSampleById(id);
            if (caseWithSample && distanceMatrixId) {
                await deleteCaseById(id);
            }
            if (caseWithSample?.sample) {
                await deleteSampleById(caseWithSample?.sample.id);
            }
            if (caseWithSample?.sample) {
                await deleteDistancesBySampleId(caseWithSample?.sample.id);
            }
        });
    }
};
