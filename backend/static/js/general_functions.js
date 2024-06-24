

// #################################################
// #                register events                #
// #################################################
// functions that register common events


// #############################
// #  header events / settings #
// #############################

// Process: Define the functionality of Save and Quit in the navbar
// Input: -
// Output: -
function register_save_quit(){
    d3.select("#ref_save").on("click", function(){
        DB.export_database();
    });
    d3.select("#ref_quit").on("click", function(){
        if (confirm('Are you sure you want to quit? Unsaved data will be lost!')) {
            DB.delete().then(function(){
                redirect_if_no_db();
            });
        } else {
            // do nothing
        }
    });
}


// Process: Turn one navbar link active (-> brighter)
// Input: id of navbar link
// Output: -
function set_current_headerlink_active(header_id){
    d3.select(header_id).attr("class","nav-link active-page")
}




// #################################################
// #                Other functions                #
// #################################################
// other functions that are used on multiple pages


// #############################
// #   add/remove elements     #
// #############################


// Process: append an alert to a parent with message.
// Input: parent_id (str)
//        alert_type (str) possible: success (green), danger (red), warning (yellow), primary, secondary, info, light, dark
//        message (str)
// Output: -


//TODO docstrings above functions
/**
 * 
 * @param {*} parent_id 
 * @param {*} alert_type 
 * @param {*} message 
 */
function add_alert(parent_id, alert_type, message){
    d3.select("#"+parent_id)
        .append("div")
        .attr("class","alert alert-"+alert_type)
        .attr("role","alert")
        .html(message);
}


// #############################
// #     transform data        #
// #############################


// Process: transform list into dict with fasta ids as keys
// Input: samples (list)
// Output: samples_dict (dict/obj)
function samples_by_sampleid(samples){
    var samples_dict = {}
    for (const idx in samples) {
        samples_dict[samples[idx]["fasta_ID"]] = samples[idx]
    }
    return samples_dict;
}

// #############################
// #         checks            #
// #############################


// Process: Check wether an IMS-ID follows the intendet format
// Input: ims_id (str)
// Output: true (was ok), false (differs from format)
function is_valid_IMSID(ims_id){
    const parts = ims_id.split("-");
    if (parts.length != 8) {}
    else if (parts[0] != "IMS") {}
    else if (!parts[1].match(/^[0-9]+$/)) {}
    else if (parts[1].length != 5) {}
    else if (parts[2] != "CVDP") {}
    else if (parts[3].length != 8) {}
    else if (parts[4].length != 4) {}
    else if (parts[5].length != 4) {}
    else if (parts[6].length != 4) {}
    else if (parts[7].length != 12) {}
    else {
        return true;
    }
    return false;
}

// Process: check if the fasta file follows the fasta conventions (report errors)
// Input: fasta_array (array of strings) fasta file split by lines
// Output: warnings (arr), return deviations from syntax
function check_fasta_content(fasta_array){
    var warnings = [];

    var i = 0;
    while (i < fasta_array.length) {
        // check header
        if (fasta_array[i][0] != ">") {
            warnings.push(`Line ${i+1} should be a header (start with ">") but is starts with ${fasta_array[i][0]}`);
            i = i+1;
            continue;
        }

        //next line
        i = i+1;
        // should not be EOF
        if (i == fasta_array.length) {
            warnings.push(`Line ${i+1} should contain a Sequence as previous line is a header. But it is instead the end of file`);
            continue;
        }
        // next line should not be a header
        if (fasta_array[i][0] == ">") {
            warnings.push(`Line ${i+1} should not be a header since line ${i} is a header line.`);
            continue;
        }
        // check sequence (can be multiple lines)
        while (i < fasta_array.length && fasta_array[i][0] != ">") {
            // search for a character not in IUPAC code
            var wrong_pos = fasta_array[i].search(/[^ATGCRYSWKMBDHVNXU]+/gi);
            if (wrong_pos != -1) {
                warnings.push(`Line ${i+1} has a character that does not follow the IUPAC notation of sequences. Wrong character: ${fasta_array[i][wrong_pos]}`);
            }
            i = i+1;
        }
    }

    return warnings;
}

// #############################
// #   enable disable things   #
// #############################

// Process: clean error messages by ids
// Input: ids (list of strings)
// Output: -
function clean_messages_by_ids(ids){
    for (var id in ids) {
        d3.select("#"+ids[id]).html("&nbsp;");
    }
}

// Process: hide or reveal elements by ids
// Input: ids (list of strings), hide (bool) true -> hide, false -> reveal
// Output: -
function hide_reveal_by_ids(ids, hide){
    for (var id in ids) {
        d3.select("#"+ids[id]).attr("hidden", hide ? true : null);
    }
}

// Process: Disable or enable all buttons on current  page
// Input: enable (bool) true -> enable buttons, false -> disable buttons
// Output: -
function enable_disable_all_buttons(enable){
    d3.selectAll("button").attr("disabled", enable ? null : true);
}


// Process: Disable or enable an eventlistener that gives a promt before closing a window to not loose data
// Input: enable (bool) true -> enable eventlistener, false -> disable eventlistener
// Output: -
function enable_disable_leave_promt(enable){
    if (enable) {
        // give promt while leaving
        window.addEventListener("beforeunload", unload_event);
    } else {
        // do nothing when leaving
        window.removeEventListener("beforeunload",unload_event);
    }
}

function unload_event(event){
    event.returnValue = null;
}
