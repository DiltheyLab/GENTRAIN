var DB;


// ################################
// #          Entry point         #
// ################################

// Is called when the page is loaded
window.onload = function () {
    // redirect to /choose_data if no current DB exists
    redirect_if_no_db();
    DB = get_DB();

    // register all events / interactions on page
    register_events();

};

// ################################
// #   Page basic functionality   #
// ################################

function register_events() {
    // call needed general functions
    set_current_headerlink_active("#ref_similar");
    register_save_quit();

    // other interactions
    compare_sequence_to_RKI_db();
}

function compare_sequence_to_RKI_db() {

    // eror messages needed?


    // upon clicking the start button
    d3.select("#compare_start").on("click", function(){

        // show potential errors and progress bar
        hide_reveal_by_ids(["seq_compare_hidden_messages, seq_compare_hidden_bar"], true);

        // get entered nucleotide sequence
        const query_seq = document.getElementById("input_compare_seq").value;

        // parse content
        // TODO jonas
        // error message in compare_seq_error_message

        const out_json = {
            "fasta_content" : query_seq,
            "k" : "10"
        };

        // feed sequence into rki tree
        // send post request to backend to get the information for the ims ids
        var request = d3.json("/data/usher_nearest_k", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(out_json)
        }).then(function(d) {
          // TODO failed process
          const outArray = {
                    "IMS_ID" : d[0].IMS_ID,
                    "loc" : d[0].loc,
                    "Seqdate" : d[0].Seqdate
                };

          //console.log(test.IMS_ID[1])

        //  for (var i = 0; i < test.IMS_ID.length; i++) { console.log(test.IMS_ID[i]); }

        // clear table
        document.getElementById('similarRKI_table_body').innerHTML = '';

            // fill samples table
            table_body = d3.select("#similarRKI_table_body");
            for (var i = 0; i <= outArray.IMS_ID.length; i++) {
                var row = table_body.append('tr');
                var row_values = [
                    outArray.IMS_ID[i],
                    outArray.loc[i],
                    outArray.Seqdate[i]
                ];
                row_values.forEach( function(elem, i) {
                        row.append('td').text(elem);
                });
             }
        });//TODO catch


        // get similar sequences and their name IDs

    })
}
