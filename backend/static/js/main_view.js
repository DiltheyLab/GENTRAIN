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
  set_current_headerlink_active("#ref_main");
  register_save_quit();

  // populate page with table
  fill_samples_table();
  fill_dm_table();

  // register filtering and coloring options
  register_events_graphoptions();

  // graph
  handle_graph_drawing();

  // TODO make tables on main page collaplable
}

// ################################
// #           Tables             #
// ################################

// Process: Fill distancematrix table from db
// Input: -
// Output: -
function fill_dm_table() {
  // request all samples
  var seqs = DB.get_dm();
  seqs.then(function (dm) {
    if (dm.length == 0) {
      d3.select("#dm_last_edited").html("Es wurde keine Distanzmatrix gefunden.");
      // d3.select("#dm_last_edited").html("No distancematrix was found");
      return;
    }
    matrix = dm[0]["matrix"];
    row_column_names = dm[0]["row_column_names"];

    d3.select("#dm_last_edited").html("Letzte Änderung: " + dm[0]["edit_timestamp"].toLocaleString());
    // d3.select("#dm_last_edited").html("Last edited: " + dm[0]["edit_timestamp"].toLocaleString());

    // fill header
    table_header = d3.select("#main_dm_table_header");
    [""].concat(row_column_names).forEach((id, i) => {
      table_header.append("td").text(id);
    });
    // fill body
    table_body = d3.select("#main_dm_table_body");
    matrix.forEach((matrix_row, i) => {
      var row = table_body.append("tr");
      var row_values = [row_column_names[i]].concat(matrix_row);
      row_values.forEach(function (elem, i) {
        if (elem == -1) {
          elem = "-";
        }
        row.append("td").text(elem);
      });
    });
  });
}

// Process: Fill samples table from db
// Input: -
// Output: -
function fill_samples_table() {
  // request all samples
  var seqs = DB.get_samples();

  // fill Table
  seqs.then(function (samples) {
    // write some Infos about samples
    d3.select("#samples_info").html("Es sind " + samples.length + " Fälle in dem Datensatz.");
    // d3.select("#samples_info").html("There are " + samples.length + " samples in the local database.")

    // console.log(samples);

    // fill samples table
    table_body = d3.select("#main_samples_table_body");
    samples.forEach((sample, i) => {
      var row = table_body.append("tr");
      var row_values = [
        sample.fasta_ID,
        sample.IMS_ID,
        sample.group,
        sample.sampling_date,
        sample.N_count,
        sample.lineage,
        sample.location_sending_lab,
        sample.location_sequencing_lab,
        sample.other_metadata,
        sample.edit_timestamp.toLocaleString(),
        // TODO more columns here ?
      ];
      row_values.forEach(function (elem, i) {
        row.append("td").text(elem);
      });

      // console.log(sample.fasta_ID);
    });
  });
}

// ################################
// #   filter color events        #
// ################################

function register_events_graphoptions() {
  // TODO
}

// ################################
// #    calc and draw grah        #
// ################################

async function handle_graph_drawing() {
  // request DM and samples
  var dm_data = await DB.get_dm();
  var samples = await DB.get_samples();

  var dm = dm_data[0]["matrix"];
  var row_column_names = dm_data[0]["row_column_names"];

  // prepare metainformation to be added to graph
  var graph_metainfo = prepare_graph_meta(samples);

  // create mst
  console.log("DATA:", dm, row_column_names, graph_metainfo[0], graph_metainfo[1]);
  var mst = prepare_graph(dm, row_column_names, graph_metainfo[0], graph_metainfo[1]);
  console.log("MST", mst);
  // todo more options
  draw_graph(mst);

  // TODO
  // im alten dashboard wird im graphen auf sich selber verwiesen
  // in prepare add to mst source and target that go to object of an edge
  // object of an edge has name, x, y
  // make draw graph right

  // check distance function to be ok with some samples from normal daschboard
  // comment
  // make pretty
  // options
  //

  // mach proper characters sinn? was wenn nicht am anfang und ende chars rausgenommen werden?
}
