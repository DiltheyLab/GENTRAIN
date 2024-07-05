var DB;

// TODO !!!!
// include page that describes visually the structure of the data

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
  set_current_headerlink_active("#ref_data");
  register_save_quit();

  // other interactions

  register_events_sequences_fasta();

  // TODO ims id only upload

  // TODO add download link for tsv based on current database
  // TODO write nice documentation on html page
}

// ################################
// # sequence fasta functionality #
// ################################

//
// Workflow for adding/deleting sequences with tsv and fasta
//
// - start when the #seq_fasta_start button is pressed
// - do before care
//     - sequence_fasta_before
//         lock buttons and enable leave promt etc
// - check if files are selected and have right ending
//     - sequence_fasta_check_files
//         report errors in eror message span
// - reveal progressbar and alertbox (are updated along the way. not further mentioned in workflow)
// - try reading tsv file and check the contents syntax
//     - check_tsv_content
// - if there is a fasta file try to read it and check content syntax
//         - check_fasta_content
//     - check if all needed sequences are in fasta file
// - collect_data_add_to_DB (continue on in seperate function)
//     - Collect current data into dictionary
//     - get sequence and metadata for IMS ids without sequence
//         - /data/IMS_to_fasta
//             - IMS_to_fasta.sh
//     - get lineage, variants and N_count from backend via nextclade
//         - /data/nextclade
//             - nextlade.sh
//     - reorganise data
//     - add samples to database
//         - DB.add_sequences
//     - remove samples from database
//         - DB.remove_sequences
//     - update distance matrix with the added/removed samples
//         - calculate_updated_distancematrix
//             - calculate_single_distance
//     - Do aftercare
//         - sequence_fasta_after (unlock buttons and disable leave promt etc)
//

function register_events_sequences_fasta() {
  // clean error message if files are chosen
  d3.select("#seq_fasta_file_chooser").on("change", function () {
    d3.select("#seq_fasta_error_message").html("&nbsp;");
  });
  d3.select("#seq_fasta_tsv_file_chooser").on("change", function () {
    d3.select("#seq_fasta_tsv_error_message").html("&nbsp;");
  });

  // without fasta
  d3.select("#seq_ims_start").on("click", function () {
    // prepare
    sequence_fasta_before();

    // check if file is selected,  error msg
    if (
      !sequence_fasta_check_files(
        "",
        "",
        "seq_ims_tsv_file_chooser",
        "seq_ims_tsv_error_message"
      )
    ) {
      sequence_fasta_after(true, "");
      return;
    }

    //  unhide the progressbar and alerts
    hide_reveal_by_ids(
      ["seq_ims_hidden_bar", "seq_ims_hidden_messages"],
      false
    );

    // start processing files
    // check each file if they follow their respective syntax, error msg
    try {
      //update status
      add_alert("seq_ims_messages", "info", "Dateien werden eingelesen");
      // add_alert("seq_ims_messages", "info", "Start parsing file(s)");
      d3.select("#seq_ims_progressbar").attr("style", "width: 14%");

      // read the tsv file (continued further in function because it is async)
      var tsv_reader = new FileReader();
      tsv_file = document.getElementById("seq_ims_tsv_file_chooser").files[0];
      tsv_reader.readAsText(tsv_file, "UTF-8");
      tsv_reader.onload = function (evt) {
        // split input file by \t into array of arryas
        var tsv_array = d3.tsvParseRows(evt.target.result);
        // drop last line if empty (might not be needed)
        if (tsv_array.slice(-1) == [""]) {
          tsv_array.pop();
        }
        // remove header line
        tsv_array = tsv_array.splice(1);

        // check syntax
        if (!check_tsv_content(tsv_array)) {
          sequence_fasta_after(false, "Stopped process: Syntax error in tsv");
          return;
        }

        collect_data_add_to_DB(
          tsv_array,
          [],
          [],
          {},
          "#seq_ims_progressbar",
          "seq_ims_messages"
        );

        // Nothing sould happen here as file reading is async
      };

      // Nothing sould happen here as file reading is async
    } catch (e) {
      // clean up
      sequence_fasta_after(false, "Loading data failed: " + e.message);
      throw e.message;
    }
  });

  ////////////////////////////////////////////////////
  // with fasta
  // start button
  d3.select("#seq_fasta_start").on("click", function () {
    // prepare
    sequence_fasta_before();

    // check if files are selected (fa optional), error msg
    // check both file endings, error msg
    if (
      !sequence_fasta_check_files(
        "seq_fasta_file_chooser",
        "seq_fasta_error_message",
        "seq_fasta_tsv_file_chooser",
        "seq_fasta_tsv_error_message"
      )
    ) {
      sequence_fasta_after(true, "");
      return;
    }

    //  unhide the progressbar and alerts
    hide_reveal_by_ids(
      ["seq_fasta_hidden_bar", "seq_fasta_hidden_messages"],
      false
    );

    // start processing files
    // check each file if they follow their respective syntax, error msg
    try {
      //update status
      add_alert("seq_fasta_messages", "info", "Dateien werden eingelesen");
      // add_alert("seq_fasta_messages", "info", "Start parsing file(s)");
      d3.select("#seq_fasta_progressbar").attr("style", "width: 14%");

      // read the tsv file (continued further in function because it is async)
      var tsv_reader = new FileReader();
      tsv_file = document.getElementById("seq_fasta_tsv_file_chooser").files[0];
      tsv_reader.readAsText(tsv_file, "UTF-8");
      tsv_reader.onload = function (evt) {
        // split input file by \t into array of arryas
        var tsv_array = d3.tsvParseRows(evt.target.result);
        // drop last line if empty (might not be needed)
        if (tsv_array.slice(-1) == [""]) {
          tsv_array.pop();
        }
        // remove header line
        tsv_array = tsv_array.splice(1);

        // check syntax
        if (!check_tsv_content(tsv_array)) {
          sequence_fasta_after(false, "Stopped process: Syntax error in tsv");
          return;
        }

        // collect the fasta ids that should be in the fasta file
        var needed_fastaids = [];
        for (var i in tsv_array) {
          // if a sample has no IMS id and should be added not deleted -> has to be in fasta file
          if (tsv_array[i][2] == "" && tsv_array[i][0] == "a") {
            needed_fastaids.push(tsv_array[i][1]);
          }
        }

        // check if fasta file exists
        if (
          document.getElementById("seq_fasta_file_chooser").files.length == 1
        ) {
          // read the fasta file
          var fa_reader = new FileReader();
          fa_file = document.getElementById("seq_fasta_file_chooser").files[0];
          fa_reader.readAsText(fa_file, "UTF-8");
          fa_reader.onload = function (evt) {
            fasta_array = evt.target.result.split("\n");
            if (fasta_array.slice(-1) == "") {
              fasta_array.pop();
            }

            // check fasta syntax
            var warnings = check_fasta_content(fasta_array);
            if (warnings.length > 0) {
              for (var i in warnings) {
                add_alert("seq_fasta_messages", "warning", warnings[i]);
              }
              sequence_fasta_after(
                false,
                "Stopped process: Syntax error in fasta"
              );
              return;
            }

            // check if all fastaids needed are contained
            // prep work
            fasta_ids = [];
            fasta_id_to_sequence = {};
            current_id = "";
            current_sequence = "";
            for (var i in fasta_array) {
              if (fasta_array[i][0] == ">") {
                fasta_id = fasta_array[i].slice(1).split(/\s+/)[0];
                fasta_ids.push(fasta_id);

                // start new sequence collection
                current_id = fasta_id;
                current_sequence = "";
              } else {
                current_sequence += fasta_array[i].trim();
              }
              fasta_id_to_sequence[current_id] = current_sequence;
            }

            // actual check
            for (var i in needed_fastaids) {
              if (!fasta_ids.includes(needed_fastaids[i])) {
                sequence_fasta_after(
                  false,
                  `Stopped process: fasta id ${needed_fastaids[i]} from tsv file not found in fasta file.`
                );
                return;
              }
            }

            // report syntax check success
            add_alert(
              "seq_fasta_messages",
              "success",
              "Dateien fertig eingelesen."
            );
            // add_alert("seq_fasta_messages", "success", "Finished parsing file(s)");

            // continue process ( in new function and not after else because file reading is async )
            collect_data_add_to_DB(
              tsv_array,
              fasta_array,
              fasta_ids,
              fasta_id_to_sequence,
              "#seq_fasta_progressbar",
              "seq_fasta_messages"
            );
          };
          // if no fasta file was given
        } else {
          // check if a fasta id is requested -> stop and trow error message
          if (needed_fastaids.length > 0) {
            sequence_fasta_after(
              false,
              `Prozess abgebrochen: Fasta id ${needed_fastaids[0]} aus tsv Datei wurde nicht in der fasta Datei gefunden.`
            );
            // sequence_fasta_after(false, `Stopped process: fasta id ${needed_fastaids[0]} from tsv file not found in fasta file.`);
            return;
          }
          // continue process ( in new function and not after else because file reading is async )
          collect_data_add_to_DB(
            tsv_array,
            [],
            [],
            {},
            "#seq_fasta_progressbar",
            "seq_fasta_messages"
          );
        }

        // Nothing sould happen here as file reading is async
      };

      // Nothing sould happen here as file reading is async
    } catch (e) {
      // clean up
      sequence_fasta_after(false, "Ein Fehler ist aufgetreten: " + e.message);
      // sequence_fasta_after(false, "Loading data failed: " + e.message);
      throw e.message;
    }
  });
}

// Process: Collect data (IMS ids) and add data to the database. Meanwhile report status with alerts
// Input: tsv_array (array of array of strings) tsv file split by lines and tabs,
//        fasta_array (array of strings) fasta file split by lines
// Output: -
function collect_data_add_to_DB(
  tsv_array,
  fasta_array,
  fasta_ids,
  fasta_id_to_sequence,
  progressbar_id,
  alertbox_id
) {
  // declare the vars here so they can be used in multiple then functions
  var pseudonyms_to_fasta_id = {};
  var sequences_add = [];
  var sequences_remove = [];
  var fastaid_to_alldata = {};
  var fasta_ids_toadd = [];

  // ####################################
  //   Collect data into dictionary
  // ####################################

  // keys: fasta id, value: dict of values
  for (var i in tsv_array) {
    // as RKI fasta file only has upper case ids
    tsv_array[i][2] = tsv_array[i][2].toUpperCase();

    // IMS ID is fasta id if fasta id is empty
    fasta_id = tsv_array[i][1];
    if (tsv_array[i][1] == "") {
      fasta_id = tsv_array[i][2];
    }

    // add
    if (tsv_array[i][0] == "a") {
      // fill fastaid_to_alldata object with current sample
      fastaid_to_alldata[fasta_id] = {
        edit_option: tsv_array[i][0],
        IMS_ID: tsv_array[i][2],
        group: tsv_array[i][3], /// TODO !!! add group data to outbreaks table (also rename)
        sequence: fasta_id_to_sequence[fasta_id],
        sampling_date: tsv_array[i][4],
        other_metadata: tsv_array[i][5],
        // TODO also maybe other
        // After nextclade: Ns lineage, variants
      };
      // delete (these wont be send to the backend for nextclade and co)
    } else if (tsv_array[i][0] == "d") {
      sequences_remove.push(fasta_id);
      // should not happen as the input was parsed, but just to be safe
    } else {
      sequence_fasta_after(
        false,
        `Prozess abgebrochen: Option ${fastaid_to_alldata[fasta_id]["edit_option"]} ist nicht erlaubt.`
      );
      // sequence_fasta_after(false, `Stopped process: Option ${fastaid_to_alldata[fasta_id]["edit_option"]} is not allowed`);
      return;
    }
  }

  // ####################################
  //   IMS id to fasta
  // ####################################
  // report status
  add_alert(
    alertbox_id,
    "info",
    "Sequenzen und metadaten der IMS-IDs werden heruntergeladen."
  );
  // add_alert(alertbox_id, "info", "Getting sequences and metadata for IMS ids");
  d3.select(progressbar_id).attr("style", "width: 28%");

  var imsids_requestable = [];
  for (var i in tsv_array) {
    // if there is a ims id and the fastaid is not in the fasta file
    if (tsv_array[i][2] != "" && !fasta_ids.includes(tsv_array[i][1])) {
      imsids_requestable.push(tsv_array[i][2]);
    }
  }

  // send post request to backend to get the information for the ims ids
  var request = d3
    .json("/data/IMS_to_fasta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "IMS-IDs": imsids_requestable }),
    })
    .then(function (imsid_to_data) {
      // if failed stop
      if (imsid_to_data == null) {
        sequence_fasta_after(
          false,
          `Stopped process: An error occured while getting the information for the IMS-IDS`
        );
        return;
      }
      console.log("Data collected from ims ids");
      console.log(imsid_to_data);

      // incorporate collected data into data dictionary
      // Current: overwrite data with collected data (is not everything)
      // TODO option keep stuff from tsv and only write collected stuff if otherwise empty?
      for (var fasta_id in fastaid_to_alldata) {
        ims_id = fastaid_to_alldata[fasta_id]["IMS_ID"];
        if (ims_id in imsid_to_data) {
          fastaid_to_alldata[fasta_id]["sequence"] =
            imsid_to_data[ims_id]["sequence"];
          fastaid_to_alldata[fasta_id]["sampling_date"] =
            imsid_to_data[ims_id]["sampling_date"];
          fastaid_to_alldata[fasta_id]["location_sending_lab"] =
            imsid_to_data[ims_id]["sending_lab_city"] +
            ", " +
            imsid_to_data[ims_id]["sending_lab_zipcode"];
          fastaid_to_alldata[fasta_id]["location_sequencing_lab"] =
            imsid_to_data[ims_id]["sequencing_lab_city"] +
            ", " +
            imsid_to_data[ims_id]["sequencing_lab_zipcode"];
          // TODO could collect more to other metadata
          // After nextclade: N_count, lineage, variants
        }
      }

      // report success
      add_alert(alertbox_id, "success", "Herunterladen erfolgreich beendet");
      // add_alert(alertbox_id, "success", "Finished getting sequences and metadata for IMS ids");
      d3.select(progressbar_id).attr("style", "width: 42%");
      add_alert(
        alertbox_id,
        "info",
        "Varianten und Lineage werden mit Nextclade berechnet."
      );
      // add_alert(alertbox_id, "info", "Start calling variants and lineage with nextclade");

      // ####################################
      //   nextclade
      // ####################################

      // TODO
      //     show right error message when ims id not found in dataset

      // collect all sequences into fasta string and use pseudo ids
      var fasta_content_nextclade = "";
      pseudonyms_to_fasta_id = {};
      var pseudo_count = 0;
      for (var fasta_id in fastaid_to_alldata) {
        pseudonyms_to_fasta_id[pseudo_count] = fasta_id;
        fasta_content_nextclade +=
          ">" +
          pseudo_count +
          "\n" +
          fastaid_to_alldata[fasta_id]["sequence"] +
          "\n";

        // console.log(fasta_id, pseudo_count);

        pseudo_count += 1;
      }

      // start request to backend
      return d3.json("/data/nextclade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fasta_content: fasta_content_nextclade }),
      });
    })
    .then(function (nextclade_data) {
      // if failed stop
      if (nextclade_data == null) {
        sequence_fasta_after(
          false,
          `Prozess abgebrochen: Es gab ein Fehler mit Nextclade.`
        );
        // sequence_fasta_after(false, `Stopped process: An error occured while using nextclade`);
        return;
      }

      // incorporate collected data into data dictionary
      for (var i in nextclade_data["results"]) {
        var current_result = nextclade_data["results"][i];
        var pseudo_id = current_result["seqName"];
        var fasta_id = pseudonyms_to_fasta_id[pseudo_id];

        fastaid_to_alldata[fasta_id]["lineage"] =
          current_result["clade"] +
          ", " +
          current_result["customNodeAttributes"]["Nextclade_pango"];
        fastaid_to_alldata[fasta_id]["N_count"] =
          current_result["totalMissing"]; // + current_result["totalNonACGTNs"] // TODO this ok?
        fastaid_to_alldata[fasta_id]["variants"] = {
          substitutions: current_result["substitutions"],
          deletions: current_result["deletions"],
          insertions: current_result["insertions"],
          missing: current_result["missing"],
          nonACGTNs: current_result["nonACGTNs"],
          alignmentStart: current_result["alignmentStart"],
          alignmentEnd: current_result["alignmentEnd"],
        };
      }

      console.log("test", fastaid_to_alldata);
      // report success
      add_alert(alertbox_id, "success", "Nextclade Aufruf abgeschlossen.");
      // add_alert(alertbox_id, "success", "Finished calling variants and lineage with nextclade.");
      d3.select(progressbar_id).attr("style", "width: 57%");
      add_alert(
        alertbox_id,
        "info",
        "Fälle werden in das lokale Datenset integriert."
      );
      // add_alert(alertbox_id, "info", "Start adding collected data to the database.");

      // ####################################
      //   add to database
      // ####################################
      console.log("all data to be added");
      console.log(fastaid_to_alldata);

      // Sort data into add and remove list
      for (var fasta_id in fastaid_to_alldata) {
        current_dict = structuredClone(fastaid_to_alldata[fasta_id]);
        delete current_dict["edit_option"];
        current_dict["fasta_ID"] = fasta_id;
        current_dict["edit_timestamp"] = new Date();

        sequences_add.push(current_dict);
        fasta_ids_toadd.push(fasta_id);
      }

      console.log(sequences_add);

      // first add new ones
      add_alert(
        alertbox_id,
        "info",
        fasta_ids_toadd.length == 0
          ? "Keine Fälle hinzugefügt."
          : `Die folgenden Fälle werden hinzugefügt: ${fasta_ids_toadd.join(
              ", "
            )}.`
      );
      // add_alert(alertbox_id, "info", fasta_ids_toadd.length == 0 ?
      //     "Adding no samples." :
      //     `Adding / Updating samples with fastaids ${fasta_ids_toadd.join(", ")}.`);
      return DB.add_sequences(sequences_add);
    })
    .then(function (response) {
      // then remove sequences
      d3.select(progressbar_id).attr("style", "width: 71%");
      add_alert(
        alertbox_id,
        "info",
        sequences_remove.length == 0
          ? "Keine Fälle werden aus dem Datenset entfernt."
          : `Die folgenden Fälle werden entfernt: ${sequences_remove.join(
              ", "
            )}.`
      );
      // add_alert(alertbox_id, "info", sequences_remove.length == 0 ?
      //     "Removing no samples." :
      //     `Removing samples with fastaids ${sequences_remove.join(", ")}.`);
      return DB.remove_sequences(sequences_remove);
    })
    .then(function (response) {
      // report success
      // add_alert(alertbox_id, "success", "Added data to the database.");
      d3.select(progressbar_id).attr("style", "width: 85%");
      add_alert(alertbox_id, "info", "Die Distanzmatrix wird berechnet.");
      // add_alert(alertbox_id, "info", "Start calulating the distancematrix.");

      // ####################################
      //   distance matrix
      // ####################################

      return calculate_updated_distancematrix(
        fasta_ids_toadd,
        sequences_remove
      );
    })
    .then(function (success) {
      console.log(success);
      if (success) {
        // final success aftercare
        add_alert(alertbox_id, "success", "Prozess erfolgreich beendet.");
        // add_alert(alertbox_id, "success", "Finished the process successfully.");
        d3.select(progressbar_id).attr("style", "width: 100%");
        sequence_fasta_after(true, "");
      } else {
        // dm failed
        sequence_fasta_after(
          false,
          "Es sind Fehler beim berechnen der Distanzmatrix aufgetreten. Fälle wurden dennoch hinzugefügt."
        );
        // sequence_fasta_after(false, "Some error occured while calculating the new Distancematrix. Samples were added / updated / removed regardless.");
      }

      // ####################################
      //   errors
      // ####################################
    })
    .catch(function (e) {
      console.log("Caught exeption");
      console.log(e);
      sequence_fasta_after(
        false,
        `Prozess abgebrochen! Folgender Fehler ist aufgetreten: ${e}`
      );
      // sequence_fasta_after(false, `Stopped process: Some error occured: ${e}`);
    });

  // Do nothing after this because of async functions
}

// Process: check if the tsv file follows our tsv conventions (report errors)
// Input: tsv_array (array of array of strings) tsv file split by lines and tab
// Output: bool, true if ok, false if not
function check_tsv_content(tsv_array) {
  var valid = true;
  var correct_line_length = 6; // change this if tsv template changes

  for (var i = 0; i < tsv_array.length; i++) {
    line = tsv_array[i];

    // check line length (change this number when changing tsv layout)
    if (line.length != correct_line_length) {
      add_alert(
        "seq_fasta_messages",
        "warning",
        `Zeile ${
          i + 1
        } hat eine falscha Anzahl von Spalten. Es sollten ${correct_line_length} sein, aber es gibt ${
          line.length
        } Spalten.`
      );
      // add_alert("seq_fasta_messages", "warning", `Line ${i + 1} has the wrong amount of columns. It should be ${correct_line_length}, but is ${line.length}.`);
      valid = false;
      continue; // no need to check the other columns
    }
    // check action
    if (!["a", "d"].includes(line[0])) {
      add_alert(
        "seq_fasta_messages",
        "warning",
        `Zeile ${
          i + 1
        } hat eine falsche Aktion. Es sollte a oder d sein, aber es ist ${
          line[0]
        }.`
      );
      // add_alert("seq_fasta_messages", "warning", `Line ${i + 1} has a wrong action. It should be a or d, but is ${line[0]}.`);
      valid = false;
    }
    // check ims id
    if (line[2] != "" && !is_valid_IMSID(line[2])) {
      add_alert(
        "seq_fasta_messages",
        "warning",
        `Zeile ${
          i + 1
        } hat eine falsche IMS-ID. Eine IMD-ID sollte so aussehen: IMS-XXXXX-CVDP-XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXX . Gefundene ID: ${
          line[2]
        }.`
      );
      // add_alert("seq_fasta_messages", "warning", `Line ${i + 1} has a wrong IMS-ID. It should follow IMS-XXXXX-CVDP-XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXX, but is ${line[2]}.`);
      valid = false;
    }
    // check date
    if (line[4] != "" && isNaN(Date.parse(line[4]))) {
      add_alert(
        "seq_fasta_messages",
        "warning",
        `Zeile ${
          i + 1
        } hat ein falsches Datum. Es sollte dem ISO 8601 format folgen (zum Beispiel YYYY-MM-DD), aber es ist ${
          line[4]
        }.`
      );
      // add_alert("seq_fasta_messages", "warning", `Line ${i + 1} has a wrong date. It should follow the ISO 8601 format (for example YYYY-MM-DD), but is ${line[4]}.`);
      valid = false;
    }
    // The group column can contain any string
    // in the last column  everything is allowed
  }
  return valid;
}

// Process: check if input files are there and file ending (report errors)
// Input: -
// Output: bool, true if files ok, false if not
function sequence_fasta_check_files(
  fa_chooser,
  fa_error,
  tsv_chooser,
  tsv_error
) {
  // (but if only deleting then no fasta ok? think about this)

  fa_files = fa_chooser != "" ? document.getElementById(fa_chooser).files : "";
  tsv_files = document.getElementById(tsv_chooser).files;

  // check if a tsv file has been selected
  // fa file is optional, but leads to error later on if it was needed
  if (tsv_files.length == 0) {
    d3.select("#" + tsv_error).html("Keine Datei ausgewählt.");
    // d3.select("#" + tsv_error).html("Please select a file.")
  }
  // check if more then one file has been selected per filechooser
  else if (fa_chooser != "" && fa_files.length > 1) {
    d3.select("#" + fa_error).html("Nur eine Datei auswählen.");
    // d3.select("#" + fa_error).html("Please only select one file.")
  } else if (tsv_files.length > 1) {
    d3.select("#" + tsv_error).html("Nur eine Datei auswählen.");
    // d3.select("#" + tsv_error).html("Please only select one file.")
  }
  // check if the selected file is a fasta file or a tsv file
  // TODO maybe different file endings?
  else if (!tsv_files[0].name.endsWith(".tsv")) {
    d3.select("#" + tsv_error).html("Falsch Dateiendung. Sollte '.tsv' sein.");
    // d3.select("#" + tsv_error).html("Wrong file ending. Should be '.tsv' .")
  } else if (fa_chooser != "" && fa_files.length == 1) {
    // somwhat wierd. rewrite this
    if (
      !(fa_files[0].name.endsWith(".fasta") || fa_files[0].name.endsWith(".fa"))
    ) {
      d3.select("#" + fa_error).html(
        "Falsch Dateiendung. Sollte '.fasta' oder '.fa' sein."
      );
      // d3.select("#" + fa_error).html("Wrong file ending. Should be '.fasta' or '.fa'.")
      // if everything was ok return true
    } else {
      return true;
    }
    // if everything was ok return true
  } else {
    return true;
  }
  // return false if one of the ifs was true
  return false;
}

// Process: Take care of all things before starting to analyse the files
// Input: -
// Output: -
function sequence_fasta_before() {
  console.log("before");
  // add eventlistener to window close to prevent data loss
  enable_disable_leave_promt(true);

  // clean error messages
  clean_messages_by_ids([
    "seq_fasta_error_message",
    "seq_fasta_tsv_error_message",
    "seq_ims_tsv_error_message",
  ]);

  // hide the progressbar and alerts and reset them
  hide_reveal_by_ids(
    ["seq_fasta_hidden_bar", "seq_fasta_hidden_messages"],
    true
  );
  hide_reveal_by_ids(["seq_ims_hidden_bar", "seq_ims_hidden_messages"], true);
  d3.select("#seq_fasta_messages").html("");
  d3.select("#seq_ims_messages").html("");
  d3.select("#seq_fasta_progressbar").classed("progress-bar-animated", true);
  d3.select("#seq_fasta_progressbar").classed("progress-bar-striped", true);
  d3.select("#seq_fasta_progressbar").classed("bg-danger", false);
  d3.select("#seq_fasta_progressbar").classed("bg-success", true);
  d3.select("#seq_fasta_progressbar").attr("style", "width: 0%");
  d3.select("#seq_ims_progressbar").classed("progress-bar-animated", true);
  d3.select("#seq_ims_progressbar").classed("progress-bar-striped", true);
  d3.select("#seq_ims_progressbar").classed("bg-danger", false);
  d3.select("#seq_ims_progressbar").classed("bg-success", true);
  d3.select("#seq_ims_progressbar").attr("style", "width: 0%");

  // disable all buttons
  enable_disable_all_buttons(false);
}

//  TODO ? Add imsid interaction to before and after

// Process: clean up some stuff after finishing the file analysis (successfull or not)
// Input: -
// Output: -
function sequence_fasta_after(success, message) {
  if (success) {
    // TODO report final success
  } else {
    // report error and stop progressbar movement
    add_alert("seq_fasta_messages", "danger", message);
    d3.select("#seq_fasta_progressbar").classed("bg-success", false);
    d3.select("#seq_fasta_progressbar").classed("bg-danger", true);
    add_alert("seq_ims_messages", "danger", message);
    d3.select("#seq_ims_progressbar").classed("bg-success", false);
    d3.select("#seq_ims_progressbar").classed("bg-danger", true);
  }

  d3.select("#seq_fasta_progressbar").classed("progress-bar-animated", false);
  d3.select("#seq_ims_progressbar").classed("progress-bar-animated", false);
  d3.select("#seq_fasta_progressbar").classed("progress-bar-striped", false);
  d3.select("#seq_ims_progressbar").classed("progress-bar-striped", false);

  // enable all buttons again
  enable_disable_all_buttons(true);
  // disable leave promt
  enable_disable_leave_promt(false);

  console.log("after");
}
