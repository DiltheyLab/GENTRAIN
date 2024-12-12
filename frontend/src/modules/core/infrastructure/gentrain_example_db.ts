import Dexie from "dexie";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { Pathogen } from "@/modules/core/models/pathogens";
import gentrainApiInstance from "../adapters/GentrainApi";
import { DatabaseSchema } from "../services/database/DatabaseManager";

const gentrainExampleDB = new Dexie("gentrain_example") as DatabaseSchema;

// define the database tables (https://dexie.org/)
// first column is primary key
// ++id is autoincrementing
// *column_name = MultiEntry
gentrainExampleDB.version(1).stores({
    samples: "++id, fasta_id, case_id, lineage, n_count, sequence_length, sequence_analysis_id, created_at, updated_at",
    sequence_analyses: "++id, result, schema, version, created_at, updated_at",
    distance_matrices: "++id, pathogen_id, created_at, updated_at",
    distances: "++id, sample_id_1, sample_id_2, distance_matrix_id, value, created_at, updated_atx",
    cases: "++id, case_id, fasta_id, outbreak_id, *group_ids, pathogen_id, registered_at, created_at, updated_at, [case_id+pathogen_id], [fasta_id+pathogen_id]",
    contacts: "++id, case_id_1, case_id_2, type, context, created_at, updated_at, [case_id_1+case_id_2+type+context]",
    groups: "++id, name, category_id, pathogen_id, created_at, updated_at, [name+category_id+pathogen_id]",
    pathogens: "id, name, genetic_distance_threshold, pathogen_type_id, activated_at, created_at, updated_at",
    pathogen_types: "++id, name, initialized_at, created_at, updated_at",
    categories: "++id, name, pathogen_id, created_at, updated_at, [name+pathogen_id]",
    analyses: "++id, name, settings, pathogen_id, created_at, updated_at",
    outbreaks: "++id, name, pathogen_id, created_at, updated_at, [name+pathogen_id]",
    sequence_identifiers: "id, fasta_id, pathogen_id",
});

gentrainExampleDB.on("populate", async () => {
    let persistedPathogenTypes = {} as Record<string, number>;

    for (const pathogenTypeName of Object.keys(PathogenTypeName)) {
        const newPathogenTypeId = await gentrainExampleDB.pathogen_types.add({
            name: pathogenTypeName as unknown as PathogenTypeName,
            initialized_at: null,
        });
        persistedPathogenTypes[pathogenTypeName] = newPathogenTypeId;
    }

    const pathogens: Pathogen[] = await gentrainApiInstance.getPathogens();
    for (const pathogen of pathogens) {
        // check if the pathogen already exists in pathogen-table
        // otherwise persist pathogen
        if (!(await gentrainExampleDB.pathogens.get(pathogen.id))) {
            gentrainExampleDB.pathogens.add({
                id: pathogen.id,
                name: pathogen.name,
                genetic_distance_threshold: pathogen.genetic_distance_threshold,
                pathogen_type_id: persistedPathogenTypes[pathogen.type],
                activated_at: null,
            });
        }
    }
});

gentrainExampleDB.tables.forEach(function (table) {
    table.hook("creating", function (_primKey, obj, _transaction) {
        obj.created_at = new Date();
        obj.updated_at = new Date();
    });

    table.hook("updating", function (_modifications, _primKey, obj, _transaction) {
        obj.updated_at = new Date();
    });
});
export { gentrainExampleDB };
