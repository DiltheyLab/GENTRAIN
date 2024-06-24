function selectColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
}


/**
 * TODO
 * @param {*} samples 
 * @returns 
 */
function prepare_graph_meta(samples){

    var node_info = {};
    var edge_info = {}; // currently no info here

    // count the amount of distict groups
    groups = [];
    for (let i = 0; i < samples.length; i++) {
        groups.push(samples[i]["group"]);
    }
    groups_unique = [...new Set(groups)];
    groups_unique.sort();
    
    for (let i = 0; i < samples.length; i++) {
        node_info[samples[i]["fasta_ID"]] = {
            group: samples[i]["group"],
            color: selectColor(groups_unique.indexOf(samples[i]["group"]))
        };
    }

    return [node_info, edge_info];
}

/**
 * Create the graoh object  from a distancematrix with row and column names
 * 
 * @param {array} dm  array of arrays containing the distances
 * @param {array} row_column_names array of names (strings )
 * @param {object} returns mst  {nodes : [...], edges: [...]}
 */
function prepare_graph(dm, row_column_names, node_info, edge_info){
    // create empty graph
    var g = new jsgraphs.WeightedGraph(row_column_names.length);

    // for the top part of the dm (as it is mirrored and the diagonal is all -1)
    for (let i = 0; i < row_column_names.length -1; i++) {
        for (let j = i+1 ; j < row_column_names.length; j++) {
            // add an edge for every distance
            g.addEdge(new jsgraphs.Edge(i, j, dm[i][j]));
        }
    }

    // claculate edges that are in the mst
    var kruskal = new jsgraphs.KruskalMST(g); 
    var mst_edges = kruskal.mst;

    // create node objects (x,y values neede for the graph drawing)
    var nodes = [];
    for (let i = 0; i < row_column_names.length; i++) {
        nodes[i] = [
            {
                name: row_column_names[i],
                group: node_info[row_column_names[i]]["group"],
                color: node_info[row_column_names[i]]["color"],
                x: 1,
                y:1,
                fx: [],
                fy: [],
                vx: 1,
                vy: 1
            }
        ]
    }

    // add the references of the node objects to the edge objects
    for (let i = 0; i < mst_edges.length; i++) {
        mst_edges[i]["source"] = nodes[ mst_edges[i]["v"] ]; 
        mst_edges[i]["target"] = nodes[ mst_edges[i]["w"] ];
    }

    // final object
    var mst = {
        nodes: nodes,
        edges: mst_edges
    }

    // console.log(mst);
    return mst
}

