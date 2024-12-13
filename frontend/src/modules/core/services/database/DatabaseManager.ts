import { gentrainDB } from "@/modules/core/infrastructure/gentrain_db";
import Dexie, { type EntityTable } from "dexie";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { CaseSchema } from "@/modules/core/models/cases";
import { CategorySchema } from "@/modules/core/models/categories";
import { ContactSchema } from "@/modules/core/models/contacts";
import { DistanceMatricesSchema } from "@/modules/core/models/distance_matrices";
import { DistancesSchema } from "@/modules/core/models/distances";
import { GroupSchema } from "@/modules/core/models/groups";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { PathogenTypeSchema } from "@/modules/core/models/pathogen_types";
import { PathogenSchema } from "@/modules/core/models/pathogens";
import { SampleSchema } from "@/modules/core/models/samples";
import { SequenceAnalysisSchema } from "@/modules/core/models/sequence_analyses";
import { SequenceIdentifierSchema } from "@/modules/core/models/sequence_identifiers";
import { gentrainExampleDB } from "@/modules/core/infrastructure/gentrain_example_db";

type DatabaseName = "gentrain" | "gentrain_example";

export type DatabaseSchema = Dexie & {
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
    sequence_identifiers: EntityTable<SequenceIdentifierSchema, "id">;
};
class DatabaseManager {
    private databases: Record<DatabaseName, DatabaseSchema>;
    private currentDB: DatabaseSchema;

    constructor() {
        this.databases = {
            gentrain: gentrainDB,
            gentrain_example: gentrainExampleDB,
        };

        // Get previously selected DB from localStorage or use default
        const savedDB = (localStorage.getItem("selectedDB") as DatabaseName) || "gentrain";
        this.currentDB = this.databases[savedDB];
    }

    public switchDatabase(dbName: DatabaseName) {
        console.log("before switch", this.currentDB);

        if (!this.databases[dbName]) throw new Error(`No database with name ${dbName} found`);
        this.currentDB = this.databases[dbName];
        localStorage.setItem("selectedDB", dbName);
        console.log("after switch", this.currentDB);
    }

    public getCurrentDB() {
        const manager = this;
        return new Proxy({} as DatabaseSchema, {
            get(_target, key) {
                return manager.currentDB[key as keyof DatabaseSchema];
            },
        });
    }
}

export const dbManager = new DatabaseManager();
export const db = dbManager.getCurrentDB();
