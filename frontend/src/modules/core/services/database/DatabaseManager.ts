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

type DatabaseName = "gentrain" | "gentrain_example";

class DatabaseManager {
    private static instance: DatabaseManager;
    private databases: Record<DatabaseName, DatabaseSchema>;
    private currentDB: DatabaseSchema;

    constructor() {
        // Initilize databases
        this.databases = {
            gentrain: gentrainDB,
            gentrain_example: gentrainExampleDB,
        };

        // Get previously selected DB from localStorage or use default
        const savedDB = (localStorage.getItem("selectedDB") as DatabaseName) || "gentrain";
        this.currentDB = this.databases[savedDB];
    }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    public getCurrentDatabase() {
        console.log("this", this.currentDB);

        return this.currentDB;
    }

    // Change Database
    public switchDatabase(dbName: DatabaseName): void {
        if (this.databases[dbName]) {
            this.currentDB = this.databases[dbName];
            localStorage.setItem("selectedDB", dbName);
        } else {
            throw new Error(`Database "${dbName}" does not exist.`);
        }
        console.log("inside switch", this.currentDB.name);
    }

    public getReactiveDatabase() {
        return new Proxy({} as DatabaseSchema, {
            get: (target, prop) => {
                return this.currentDB[prop as keyof DatabaseSchema];
            },
        });
    }
}

export const dbManager = DatabaseManager.getInstance();
export const db = dbManager.getReactiveDatabase();
