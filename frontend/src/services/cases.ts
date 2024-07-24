import { deleteCaseById, getCaseWithSampleById } from "@/database/cases";
import { getOrCreateDistanceMatrixByPathogenId } from "@/database/distance_matrices";
import { deleteDistancesBySampleId } from "@/database/distances";
import { useAppStore } from "@/stores/app";

export const deleteCasebyIdAndRecalculateDistances = async (id: number) => {
    const activePathogen = useAppStore.getState().activePathogen;
    if (activePathogen) {
        const distanceMatrixId = await getOrCreateDistanceMatrixByPathogenId(activePathogen.id);
        const caseWithSample = await getCaseWithSampleById(id);
        if (caseWithSample && distanceMatrixId) {
            deleteCaseById(id);
        }
        if (caseWithSample?.sample) {
            deleteDistancesBySampleId(caseWithSample?.sample.id);
        }
    }
};
