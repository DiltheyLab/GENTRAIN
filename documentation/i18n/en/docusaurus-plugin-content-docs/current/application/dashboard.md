# Dashboard

The **Dashboard** is the central view of your entire dataset in **GENTRAIN**.  
It provides interactive **analysis and visualization tools** for all available data. In addition, it offers configuration options for visualization, an interactive graph (minimum spanning tree) for analyzing contacts and outbreaks, and tables with detailed information.

> 🌐 **Production Environment:** [https://gentrain.bi.denbi.de](https://gentrain.bi.denbi.de)

---

## Page Layout

The dashboard page is divided into three main sections:

- **Left Column (Settings & Charts):**

  - Visualization options (e.g., contact edges or unsequenced case data)
  - Coloring options for the graph (e.g., by outbreak, cluster, or time span)
  - Overview charts (e.g., cases per day, cases per outbreak/cluster)

- **Right Column (Visualization):**

  - Interactive 2D graph displaying cases (nodes) and relationships (links)
  - Legend, detail panel for selected cases, and graph settings

- **Below the Graph:**
  - Information tables with case and cluster details
  - Distance matrix of all genetic distances

---

## Settings

In the **Settings** section, you can configure the basic filters:

- **Show cases without sequences:** Toggles the display of cases that lack sequencing data.
- **Show contact edges:** Toggles contact connections in the graph. These edges contain information derived from contact tracing data or shared epidemiological characteristics.

Any changes to these settings immediately update the graph.  
If an active **pathogen change** is detected, the graph is first cleared and then rebuilt to ensure consistent visualization.

---

## Coloring

Coloring determines how nodes are visually represented in the graph.  
Available modes include:

- **Outbreaks:** Coloring by predefined outbreak groups
- **Time span:** Coloring based on case registration date
- **Clusters:** Coloring by automatically identified clusters based on genetic distances

Parameter:

- **Cluster threshold:** Defines the maximum genetic distance for grouping cases into clusters.

:::info 🧬 Explanation: Cluster

In **Cluster** mode, all connections with a genetic distance **less than or equal to** the specified _cluster threshold_ are considered.  
Contact edges are **not** used as a source of distance in this analysis.

From this graph, **connected components** are then determined:

- Components smaller than the minimum cluster size (default: **2 cases**) are filtered out.
- Remaining components receive sequential **cluster names** (e.g., _Cluster 1_) and are visually highlighted using a generated **ColorMap**.
- Cases without available sequence data are **not included** in the cluster computation, as they might otherwise form many small, artificial groups.  
  These cases are instead labeled as _“no cluster assigned”_.

:::

---

## Graph Visualization

The graph represents cases as **nodes** and genetic relationships as **gray edges** in a _minimum spanning tree_.  
Solid edges represent genetic connections **below** the pathogen-specific distance threshold, while dashed edges indicate distances **equal to or above** that threshold.  
This allows for a quick visual assessment of the genetic proximity between cases.

### Controls

#### Mouse

- 🖱️ **Scroll wheel:** Zoom in/out
- 🖱️ **Left click + drag:** Move the graph

#### Touchpad

- ✋ **Two-finger zoom:** Zoom in/out
- ✋ **One-finger drag:** Move the graph

Use the `Zoom-to-Fit` function in the bottom-right corner to fit the graph optimally to the window size.

The graph is generated from several data sources:  
**Distance matrix (genetic distances)**, **cases with relationships**, and **contact data**.  
When necessary, a background process analyzes all links and assigns cluster names accordingly.

---

## Charts

The dashboard provides two compact charts for quick insights:

- **Cases per day (AreaChart):**  
  Aggregates the number of cases by registration date and separates them by cluster.  
  Useful for identifying **temporal trends within clusters**.

- **Cases per outbreak/cluster (PieChart):**  
  Displays the **distribution of cases across identified clusters**.  
  The chart center shows the **total case count**.

**Both charts are reactive:**

- They are based on the current graph dataset and update automatically when settings or the active pathogen change.
- The “Cases per outbreak/cluster” chart is only displayed when sufficient screen space is available (e.g., on larger displays).

---

## Tables and Detailed Information

Below the visualization, you will find expandable sections containing detailed data:

- **Case information:** List of cases currently visible in the graph, including key attributes (e.g., case ID, registration date, assigned outbreak).
- **Cluster information:** Tabular overview of detected clusters, including statistics and relevant metadata.
- **Genetic distance matrix:** Detailed matrix of pairwise genetic distances used for clustering and distance calculations.  
  This matrix can also be exported as a CSV file.

**The displayed table automatically switches between cluster and case data depending on the active coloring mode.**

---

## Data Update Notes

- When the active pathogen changes, the dashboard is **reinitialized**, and the graph data are rebuilt using the latest cases, contacts, and distance matrix.

---

## Tips and Troubleshooting

- 🔍 **No data visible?**  
  Check if the correct pathogen is selected or if filters (e.g., “Show cases without sequences”) exclude all available cases.

---

## Further Information

For more details on generating the distance matrix and performing genomic operations, refer to the developer documentation section:  
`Development → Genomic Operations`.
