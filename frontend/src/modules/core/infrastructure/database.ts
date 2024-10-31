import Dexie, { type EntityTable } from "dexie";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { CaseSchema } from "@/modules/core/models/cases";
import { CategorySchema } from "@/modules/core/models/categories";
import { ContactSchema } from "@/modules/core/models/contacts";
import { DistanceMatricesSchema } from "@/modules/core/models/distance_matrices";
import { DistancesSchema } from "@/modules/core/models/distances";
import { GroupSchema } from "@/modules/core/models/groups";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { PathogenTypeSchema, PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { PathogenSchema } from "@/modules/core/models/pathogens";
import { SampleSchema } from "@/modules/core/models/samples";
import { v4 as uuidv4 } from "uuid";
import { SequenceAnalysisSchema } from "../models/sequence_analyses";
import { socket } from "@/modules/core/helpers/socket";
export interface SessionsSchema {
    id: string;
    created_at?: Date;
    updated_at?: Date;
}

const db = new Dexie("gentrain") as Dexie & {
    samples: EntityTable<SampleSchema, "id">;
    sequence_analyses: EntityTable<SequenceAnalysisSchema, "id">;
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
    sessions: EntityTable<SessionsSchema, "id">;
};

// define the database tables (https://dexie.org/)
// first column is primary key
// ++id is autoincrementing
// *column_name = MultiEntry
db.version(1).stores({
    samples: "++id, fasta_id, case_id, lineage, n_count, sequence_length, sequence_analysis_id, created_at, updated_at",
    sequence_analyses: "++id, result, schema, version, created_at, updated_at",
    distance_matrices: "++id, pathogen_id, created_at, updated_at",
    distances: "++id, sample_id_1, sample_id_2, distance_matrix_id, value, created_at, updated_atx",
    cases: "++id, case_id, fasta_id, outbreak_id, *group_ids, pathogen_id, registered_at, created_at, updated_at, [case_id+pathogen_id], [fasta_id+pathogen_id]",
    contacts: "++id, case_id_1, case_id_2, type, context, created_at, updated_at, [case_id_1+case_id_2+type+context]",
    groups: "++id, name, category_id, pathogen_id, created_at, updated_at",
    pathogens: "id, name, genetic_distance_threshold, pathogen_type_id, activated_at, created_at, updated_at",
    pathogen_types: "++id, name, initialized_at, created_at, updated_at",
    categories: "++id, name, pathogen_id, created_at, updated_at",
    analyses: "++id, name, settings, pathogen_id, created_at, updated_at",
    outbreaks: "++id, name, pathogen_id, created_at, updated_at, [name+pathogen_id]",
    sessions: "id, created_at, updated_at",
});

db.on("populate", async () => {
    let persistedPathogenTypes = {} as Record<string, number>;
    const pathogens: {
        id: number;
        name: string;
        type: PathogenTypeName;
        genetic_distance_threshold: number;
    }[] = await fetch(`${import.meta.env.VITE_API_HOST}/pathogens`).then((response) => response.json());
    for (const pathogenTypeName of Object.keys(PathogenTypeName)) {
        const newPathogenTypeId = await db.pathogen_types.add({
            name: pathogenTypeName as unknown as PathogenTypeName,
            initialized_at: null,
        });
        persistedPathogenTypes[pathogenTypeName] = newPathogenTypeId;
    }

    for (const pathogen of pathogens) {
        // check if the pathogen already exists in pathogen-table
        // otherwise persist pathogen
        if (!(await db.pathogens.get(pathogen.id))) {
            db.pathogens.add({
                id: pathogen.id,
                name: pathogen.name,
                genetic_distance_threshold: pathogen.genetic_distance_threshold,
                pathogen_type_id: persistedPathogenTypes[pathogen.type],
                activated_at: null,
            });
        }
    }
});

db.sessions.hook("creating", function (_primKey, obj, _transaction) {
    obj.id = uuidv4();
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

export { db };
