// --------Tutorial links ---------------
// https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8

// this is also helpful to understand the simulation
// https://observablehq.com/@ben-tanen/a-tutorial-to-using-d3-force-from-someone-who-just-learned-ho


// ###################################### //
//               legend                   //
// ###################################### //


function draw_legend(container, nodes, color_scale) {

    // get all types of nodes
    var node_types = nodes.map(function (d) { return d[0].group });

    // only keep unique types and sort them
    var tmp_set = new Set();
    node_types.forEach(function (v) { return tmp_set.add(v) });
    node_types = [];
    tmp_set.forEach(function (v) { return node_types.push(v) });
    node_types.sort();


    // Add one dot in the legend for each name.
    var dots = container.selectAll(".type_dots")
        .data(node_types);
    var dots_enter = dots.enter()
        .append("circle")
        .attr("class", "type_dots")
        .attr("cx", 0)
        .attr("cy", function (d, i) { return 8 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function (d, i) { return selectColor(i) }); // TODO color with a dictionary
        // .style("fill", function (d, i) { return "#8B88E6" }); // TODO color with a dictionary


    // add a label for each type next to the dot
    var labels = container.selectAll(".type_labels")
        .data(node_types)
    labels.enter().append("text")
        .attr("class", "type_labels")
        .attr("x", 10)
        .attr("y", function (d, i) { return 12 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d, i) { return selectColor(i) }) // TODO color
        .text(function (d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

};



// ###################################### //
//       main funciton to draw graph      //
// ###################################### //




//   TODO describe everythoing that happens here in text format


function draw_graph(mst) {


    ////////////////////////////
    //     initial stuff      //
    ////////////////////////////

    // set width of svg to width of parent col 
    d3.select("#genomic_graph")
        .attr("width", function () {
            let parentSelection = d3.select(this.parentNode)
            let width = parentSelection.style('width');
            return width.split(".")[0];
        });


    // get width to calculate center point later
    var svg = d3.select("#genomic_graph");
    const width = svg.attr("width");
    const height = svg.attr("height");

    // create simulation
    var simulation = d3.forceSimulation();
    simulation
        .force("charge", d3.forceManyBody().strength(-20))
        .force("collision", d3.forceCollide().radius(8))
        .force("xforce", d3.forceX(width * 1 / 2))
        .force("yforce", d3.forceY(height * 1 / 2));
        // link force is added later

    nalpha = 1.0
    simulation.alpha(nalpha);
    simulation.alphaTarget(0).restart();
    const margin = { top: 10, right: 100, bottom: 60, left: 50 };
    const innerwidth = width - margin.left - margin.right



    // prepare and draw legend
    var legendc = svg.selectAll(".legend_container").data([4]);
    legendc.enter()
        .append("g")
        .attr("class", "legend_container")
        .attr("transform", "translate(8,8)");


    draw_legend(svg.select(".legend_container"), mst.nodes);
    // draw_legend(svg.select(".legend_container"));




    ////////////////////////////
    //       add links        //
    ////////////////////////////

    // prepare linkgroup_container
    var lgf = svg.selectAll(".linkgroup_container").data([2]);
    lgf = lgf.enter()
        .append("g")
        .attr("class", "linkgroup_container")
        .attr("transform", "translate(" + (margin.left) + ", " + margin.top + ")")
        .merge(lgf);

    // fill links with data
    var linkdl = lgf.selectAll(".linkgroup").data(mst.edges);
    var linkgroups = linkdl.enter()
        .append("g")
        .attr("class", "linkgroup")

    // set link classes accordingly
    linkgroups.append("line")
        .attr("class", function (d) { return d.weight == 0 ? "linkline z_linkline" : "linkline nz_linkline" })
    // .attr("class", "linkline")


    // // set link classes accordingly
    // linkgroups.append("line")
    //     .attr("class", function(d) {
    //         if (d.mst && d.infectionpair) {
    //             return "linkline mst_infection_linkline"
    //         } else if (d.mst && !d.infectionpair) {
    //             return "linkline mst_linkline"
    //         } else if (!d.mst && d.infectionpair) {
    //             return "linkline infection_linkline"
    //         } else {
    //             return "linkline similar_linkline"
    //         }
    //     })

    // add arrowheads to lines that need one
    // linkgroups.selectAll(".infection_linkline")
    //     .attr("marker-end",
    //     function(d) {
    //         return d.arrowhead == d.target? "url(#arrowhead-end)" : "";
    //     });
    // linkgroups.selectAll(".infection_linkline")
    //     .attr("marker-start",
    //     function(d) {
    //         return d.arrowhead == d.source? "url(#arrowhead-start)" : "";
    //     });
    // linkgroups.selectAll(".mst_infection_linkline")
    //     .attr("marker-end",
    //     function(d) {
    //         return d.arrowhead == d.target? "url(#mst_arrowhead-end)" : "";
    //     });
    // linkgroups.selectAll(".mst_infection_linkline")
    //     .attr("marker-start",
    //     function(d) {
    //         return d.arrowhead == d.source? "url(#mst_arrowhead-start)" : "";
    //     });

    // add text to links
    linktext = linkgroups.append("text")
        .attr("class", "linktexts")
        .attr("x", function (d) { return 1 })
        .attr("y", function (d) { return 1 })
        // .attr("x", function (d) {console.log(d.source.x); return (d.source.x + d.target.x) / 2 })
        // .attr("y", function (d) { return (d.source.y + d.target.y) / 2 })
        .attr("font-size", 7)
        .text(1); // will be set later anyway in ticked()


    // finish line adding
    linkgroups = linkgroups.merge(linkdl)
    var linkline = linkgroups.selectAll(".linkline")
    var linktext = linkgroups.selectAll(".linktexts")
    linkdl.exit().remove();



    ////////////////////////////
    //        add nodes       //
    ////////////////////////////


    // prepare nodegroup_container
    var ngf = svg.selectAll(".nodegroup_container").data([3]);
    ngf = ngf.enter()
        .append("g")
        .attr("class", "nodegroup_container")
        .attr("transform", "translate(" + (margin.left) + ", " + margin.top + ")")
        .merge(ngf);

    // fill nodes with data
    var ngdl = ngf.selectAll(".nodegroup").data(mst.nodes);
    ngdl.exit().remove();

    // add nodeclass
    var nodes = ngdl.enter()
        .append("g")
        .attr("class", "nodegroup")
        .attr("transform", "translate(100, 100 )");

    // add nodetext
    var ntext = nodes.append("text")
        .attr("x", function (d) { return 12 }) // text to the right
        .attr("y", function (d) { return 3 }) // text to the bottom
        .attr("class", "nodetext")
        .text(function (d) { return d[0].name });

    // // add node titles
    // var titles = nodes.append("title")
    //     .html(function(d) { return row_column_names[d] });

    // draw circle for each node
    var circles = nodes.append("circle");

    nodes = nodes.merge(ngdl);
    nodes.selectAll("circle")
        .attr("fill", function (d) {
            // console.log(d);
            return d[0].color;
            // return "#8B88E6"
            // return d.type == "similar" ? "#8B88E6" : "#444"
        })
        .attr("r", 8)
        .style("stroke", "#fff");




    /////////////////////////////////////////
    // interaction/animation funcitonality //
    /////////////////////////////////////////

    // add drag interaction
    nodes.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // add force to simulation
    var xForce = simulation.force("xforce");
    xForce.x(function (d) { return innerwidth * 1 / 2 ; })
    // xForce.x(function (d) { return innerwidth * 1 / 2 - 30; })
        .strength(function (d) { return 0.1 });

    simulation.nodes(mst.nodes)
        .on("tick", ticked);

    var linklen_factor = d3.scaleLinear()
        .domain([10, 200])
        .range([2, 1.2])
        // .range([2,1.2])
        .clamp(true);

    simulation.force("link", d3.forceLink(mst.edges)
        // .id(function (d) { return "" })
        // .distance(function (d) { return 85 })
        .distance(function (d) { return (d.weight +20) * linklen_factor(mst.nodes.length) + 2 })
        // .distance(function (d) { return 40 * linklen_factor(mst.nodes.length) + 2 })
        // .strength(8));
        .strength(0.6));



    var repulsion_scale = d3.scaleLinear()
        .domain([10, 200])
        .range([-300, -200])
        // .range([-300, -50])
        .clamp(true);


    simulation.force("charge").strength(repulsion_scale(mst.nodes.length));
    // console.log(mst.nodes.length);

    function ticked() {
        // console.log("ticked");
        linkline
            .attr("x1", function (d) { return d.source.x })
            .attr("y1", function (d) { return d.source.y })
            .attr("x2", function (d) { return d.target.x })
            .attr("y2", function (d) { return d.target.y });
        linktext
            .attr("x", function (d) { return (d.source.x + d.target.x) / 2 })
            .attr("y", function (d) { return (d.source.y + d.target.y) / 2 })
            .text(function (d) { return d.weight });
        nodes
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")" });
    }

    function dragstarted(event, d) {
        // console.log("dragstarted");
        if (!event.active) simulation.alphaTarget(0.2).restart();
        // if (!d3.event.active) simulation.alphaTarget(0.2).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        // console.log("dragged");
        d.fx = event.x;
        d.fy = event.y;
        // d.fx = d3.event.x;
        // d.fy = d3.event.y;
    }

    function dragended(event, d) {
        // console.log("dragended");
        if (!event.active) simulation.alphaTarget(0);
        // if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    ////////////////////////////
    //    initial settings    //
    ////////////////////////////

    // set to current button pressed
    // set_nodelabels();
    // set_graph_visibility();


}