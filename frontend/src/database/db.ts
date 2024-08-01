import Dexie, { type EntityTable } from "dexie";
import { exportDB, importInto } from "dexie-export-import";
import type { SampleSchema } from "@/database/samples";
import { downloadFile } from "@/services/files";
import { DistanceMatricesSchema, getDistanceMatrixByPathogenId } from "./distance_matrices";
import { DistancesSchema } from "./distances";
import { CaseSchema } from "./cases";
import { ContactSchema } from "./contacts";
import { deleteGroupsByPathogenId, GroupSchema } from "./groups";
import { Pathogens, PathogenSchema } from "./pathogens";
import { PathogenTypeName, PathogenTypeSchema } from "./pathogen_types";
import { CategorySchema, deleteCategoriesByPathogenId } from "./categories";
import { AnalysisSchema, deleteAnalysesByPathogenId } from "./analyses";
import { deleteOutbreaksByPathogenId, OutbreakSchema } from "./outbreaks";

const db = new Dexie("gentrain") as Dexie & {
    samples: EntityTable<SampleSchema, "id">;
    distance_matrices: EntityTable<DistanceMatricesSchema, "id">;
    distances: EntityTable<DistancesSchema, "id">;
    cases: EntityTable<CaseSchema, "id">;
    contacts: EntityTable<ContactSchema, "id">;
    groups: EntityTable<GroupSchema, "id">;
    pathogens: EntityTable<PathogenSchema, "id">;
    pathogen_types: EntityTable<PathogenTypeSchema, "id">;
    categories: EntityTable<CategorySchema, "id">;
    analyses: EntityTable<AnalysisSchema, "id">;
    outbreaks: EntityTable<OutbreakSchema, "id">;
};

// define the database tables (https://dexie.org/)
// first column is primary key
// ++id is autoincrementing
// *column_name = MultiEntry
db.version(1).stores({
    samples:
        "++id, fasta_id, case_id, ims_id, group, n_count, sequence_length, location_sending_lab, location_sequencing_lab, lineage, variants, metadata, sampled_at, created_at, updated_at",
    distance_matrices: "++id, pathogen_id, created_at, updated_at",
    distances: "++id, sample_id_1, sample_id_2, distance_matrix_id, value, created_at, updated_atx",
    cases: "++id, case_id, fasta_id, outbreak_id, *group_ids, pathogen_id, registered_at, created_at, updated_at",
    contacts: "++id, case_id_1, case_id_2, type, context, created_at, updated_at, [case_id_1+case_id_2+type+context]",
    groups: "++id, name, category_id, pathogen_id, created_at, updated_at",
    pathogens: "++id, name, relationship_threshold, pathogen_type_id, activated_at, created_at, updated_at",
    pathogen_types: "++id, name, created_at, updated_at",
    categories: "++id, name, pathogen_id, created_at, updated_at",
    analyses: "++id, name, settings, pathogen_id, created_at, updated_at",
    outbreaks: "++id, name, pathogen_id, created_at, updated_at, [name+pathogen_id]",
});

db.on("populate", async () => {
    let persistedPathogenTypes = {} as Record<string, number>;
    for (const [pathogenName, pathogenData] of Object.entries(Pathogens)) {
        // retrieve pathogen type name from enum
        const pathogenTypeName = PathogenTypeName[pathogenData.type];
        // check if the type of the pathogen (bacteria or virus) already exists in pathogen_types-table
        // otherwise persist pathogen_type
        if ((await db.pathogen_types.where({ name: pathogenTypeName }).count()) === 0) {
            const newPathogenTypeId = await db.pathogen_types.add({
                name: pathogenTypeName as unknown as PathogenTypeName,
            });
            persistedPathogenTypes[pathogenTypeName] = newPathogenTypeId;
        }
        // check if the pathogen already exists in pathogen-table
        // otherwise persist pathogen
        if ((await db.pathogens.where({ name: pathogenName }).count()) === 0) {
            db.pathogens.add({
                name: pathogenName,
                relationship_threshold: pathogenData.relationshop_threshold,
                pathogen_type_id: persistedPathogenTypes[pathogenTypeName],
                activated_at: null,
            });
        }
    }
});

db.tables.forEach(function (table) {
    table.hook("creating", function (_primKey, obj, _transaction) {
        obj.created_at = new Date();
        obj.updated_at = new Date();
    });

    table.hook("updating", function (_modifications, _primKey, obj, _transaction) {
        obj.updated_at = new Date();
    });
});

const importDataFromJson = async (file: Blob) => {
    db.tables.forEach((table) => {
        table.clear();
    });
    await importInto(db, file);
};

const exportDatabaseToJson = async () => {
    const blob = await exportDB(db);
    downloadFile(blob, `gentrain_export_${new Date().toISOString()}.json`);
};

const deleteDataForPathogen = async (pathogen_id: number) => {
    await db.transaction(
        "rw",
        [
            db.cases,
            db.samples,
            db.contacts,
            db.cases,
            db.distances,
            db.distance_matrices,
            db.outbreaks,
            db.categories,
            db.groups,
            db.analyses,
        ],
        async () => {
            const distanceMatrix = await getDistanceMatrixByPathogenId(pathogen_id);
            const cases = await db.cases.where({ pathogen_id: pathogen_id }).toArray();
            const deletions = [];
            for (const caseData of cases) {
                if (caseData.fasta_id) {
                    deletions.push(db.samples.where({ fasta_id: caseData.fasta_id }).delete());
                }
                deletions.push(
                    db.contacts.where({ case_id_1: caseData.id }).or("case_id_2").equals(caseData.id).delete()
                );
                deletions.push(db.cases.where({ id: caseData.id }).delete());
            }
            if (distanceMatrix?.id) {
                deletions.push(db.distances.where({ distance_matrix_id: distanceMatrix.id }).delete());
                deletions.push(db.distance_matrices.where({ id: distanceMatrix.id }).delete());
            }
            deletions.push(deleteOutbreaksByPathogenId(pathogen_id));
            deletions.push(deleteCategoriesByPathogenId(pathogen_id));
            deletions.push(deleteGroupsByPathogenId(pathogen_id));
            deletions.push(deleteAnalysesByPathogenId(pathogen_id));

            await Promise.all(deletions);
        }
    );
};

export { db, importDataFromJson, exportDatabaseToJson, deleteDataForPathogen };
