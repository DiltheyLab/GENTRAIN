var DB;

// ################################
// #          Entry point         #
// ################################

// Is called when the page is loaded
window.onload = function () {
    register_events();
};

// ################################
// #   Page basic functionality   #
// ################################

function register_events() {
    // call needed general functions
    // none needed

    // other interactions:

    // when selecting a file clean the error message
    d3.select("#json_file_chooser").on("change", function(){
        d3.select("#error_message").html("&nbsp;")
    });

    // buttons:

    // "Load" button: collect file and redirect if everything ok
    // otherwise display errors or warnings
    d3.select("#load_data_button").on("click", function(){
        // check file count and file ending
        if (check_input_file()) {
            file = document.getElementById("json_file_chooser").files[0];
            // process file content
            opendb_and_redirect_if_ok(file, "/");
        }
    });


    // "Empty Dataset" button. get empty json via request and set as DB and redirect to data page
    d3.select("#empty_data_button").on("click", function(){
        fetch("/example_datasets/empty_dataset.json").then(function(res){
            return res.blob();
        }).then(function(blob){
            opendb_and_redirect_if_ok(blob, "/data");
        });
    });

    // "Example dataset" button. get example json via request and set as DB and redirect to main page
    d3.select("#example_data_button").on("click", function(){
        fetch("/example_datasets/example_dataset.json").then(function(res){
            return res.blob();
        }).then(function(blob){
            opendb_and_redirect_if_ok(blob, "/");
        });
    });
}


// Process: check if DB already exists -> ask if ok to overwrite -> lead DB from file
// Input: file_name (String), from input field, empty string when opening empty DB, or example file
//        redirect_path (String), to which page will be redirected
// Output: -
function opendb_and_redirect_if_ok(file_name, redirect_path) {
    DB_exists().then(function (exists) {
        // if a database already exists
        if (exists) {
            // check with user if it is ok delete old DB
            if (confirm('Are you sure you want to open this Database? There already is an active Database which will be closed. Unsaved data will be lost!')) {
                // delete previous DB
                DB = get_DB();
                DB.delete().then(function(){
                    // get new empty DB
                    DB = get_DB();
                    // fill new one with file content
                    return DB.fill_db_from_file(file_name);
                }).then(function(){
                    // redirect page if succeded
                    window.location.replace(redirect_path);
                }).catch(function(e){
                    // catch error from loading file and display error
                    d3.select("#error_message").html("Something went wrong when loading the file into the database. Please check file.")
                    console.log(e);
                });

            // if it was not confirmed
            } else {
                // do nothing
            }

        // if there was no previous DB
        } else {
            // create new DB and fill
            DB = get_DB();

            DB.fill_db_from_file(file_name).then(function(){
                // redirect if succeded
                window.location.replace(redirect_path);

            }).catch(function(e){
                // catch error from loading file and display error
                d3.select("#error_message").html("Something went wrong when loading the file into the database. Please check file.")
                console.log(e);
            });
        }
    });
}


// Process: checks conditions for selected file in json_file_chooser
// Input: -
// Output: True if everything ok, otherwise false
function check_input_file(){
    files = document.getElementById("json_file_chooser").files

    // check if a file has been selected
    if (files.length == 0) {
        d3.select("#error_message").html("Please select a file.")
        return false;
    }
    // check if more then one file has been selected
    if (files.length > 1) {
        d3.select("#error_message").html("Please only select one file.")
        return false;
    }
    // check if the selected file is a json file
    if (!files[0].name.endsWith(".json")) {
        d3.select("#error_message").html("Wrong file ending. Should be '.json'.")
        return false;
    }

    // if everything was ok return true
    return true;
}
