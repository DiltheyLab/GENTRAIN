

// #################################################
// #                Database class                 #
// #################################################

// handels all interactions with the IndexDB database
// includes import and export funcitons
// request to the database return promises
// Under construction



class Database {

    // ################################
    // #         Constructor          #
    // ################################
    // Create or connect to Database and define the Database structure
    constructor() {
        // open database or create new one
        this.db = new Dexie('Dashboard_data');

        // define the database tables (syntax: https://dexie.org/docs/Version/Version.stores())
        // first column is primary key
        // ++id is autoincrementing
        // *column_name = MultiEntry
        this.db.version(1).stores({
            // Disclaimer: every time you edit this you need to change the example and empty dataset
            // TODO add variants to samples table
            samples: "fasta_ID, IMS_ID, group, sequence, N_count, variants, location_sending_lab, location_sequencing_lab, lineage, sampling_date, other_metadata, edit_timestamp",
            contacts: "contact_ID, case_ID_1, case_ID_2, type, other_metadata, edit_timestamp",
            outbreaks: "outbreak_name, date, samples, background_samples, other_metadata, edit_timestamp",
            cases: "case_ID, fasta_ID, date, other_metadata, edit_timestamp",
            distancematrix: "id, row_column_names, matrix, edit_timestamp",
        });

    }



    // ################################
    // #        Data requests         #
    // ################################
    // This section contains methods to request data. always return promises

    // return promise of samples array
    get_samples(){
        return this.db.samples.toArray();
    }
    // return promise of samples array
    get_samples_by_fastaid(fasta_ids){
        return this.db.samples.where("fasta_ID").anyOf(fasta_ids).toArray();
    }


    get_dm(){
        return this.db.distancematrix.toArray();
    }

    // ################################
    // # Add /remove data in database #
    // ################################
    // This section contains methods to add and remove data in the database


    update_dm(dm_data){
        return this.db.distancematrix.put(dm_data);
        // return this.db.samples.bulkAdd(sequences);
    }
    add_sequences(sequences){
        return this.db.samples.bulkPut(sequences);
        // return this.db.samples.bulkAdd(sequences);
    }

    remove_sequences(fasta_ids){
        return this.db.samples.bulkDelete(fasta_ids);
    }

    // ################################
    // #    Import / Export / Delete  #
    // ################################


    // Process: fill the database from a json file
    // Input: input_file, either file path or blob
    // Output: Promise after importing
    fill_db_from_file(input_file){
        return this.db.import(input_file);
    }

    // Process: export current database to json format
    // Input: -
    // Output: -
    export_database(){
        this.db.export({prettyJson: true}).then(function(blob){
            download(blob, "dashboard-export.json", "application/json");
        });
    }

    // Process: delete current Database
    // Input: -
    // Output: Promise after deletion
    delete(){
        return this.db.delete();
    }
}


// #################################################
// #                Other fuctions                 #
// #################################################

// Process: check if a database exists and if not redirect to /choose_data
// Input: -
// Output: -
function redirect_if_no_db(){
    Dexie.exists('Dashboard_data').then(function (exists) {
        if (!exists) {
            window.location.replace("/choose_data");
        }
    });
}

// Process: check if a database exists
// Input: -
// Output: Promise with parameter exists (boolean)
function DB_exists(){
    return Dexie.exists('Dashboard_data');
}


// Process: Connect to existing DB or create a new empty DB
// Input: -
// Output: Database object
function get_DB(){
    return new Database();
}
