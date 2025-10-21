---
id: outbreakAnalysis
title: Outbreak Analysis
sidebar_label: Outbreak Analysis
sidebar_position: 3
---

# Outbreak Analysis

The **Outbreak Analysis** is the interactive tool in **GENTRAIN** that allows you to examine outbreaks in detail and trace infection chains.  
This page explains the main components and provides a step-by-step guide for performing typical analysis tasks.

---

## Overview

The Outbreak Analysis interface consists of two main sections:

- **Left sidebar:** Analysis settings and filters (outbreak selection, background selection, case filters, contact tracing, color settings, export functions)
- **Main area:** Interactive visualization (Minimum Spanning Tree), case detail views, legend, and graph tools

In short:  
On the left, you select **what** is displayed — on the right, you see **the results** as an interactive graph.

---

## Step-by-Step Guide: Starting an Analysis

### 1. Select an Outbreak

- Open the **Ausbruchsauswahl** panel in the left sidebar (Step 1).
- Select the outbreak you would like to analyze.  
  If no outbreak has been created yet, you can either generate one using clustering in the **Dashboard**, or create a new outbreak and assign cases in the **Datenverwaltung** section.

### 2. Select Background Data

- In the **“Umgebung auswählen”** section (Step 2), define which additional case data (e.g., other outbreaks or groups) should be included in the visualization.
- Options:
  - **Keine Falldaten:** Only cases from the selected outbreak
  - **Alle Falldaten:** Include all imported cases
  - **Falldaten auswählen:** Include only specific groups or other outbreaks

### 3. Filter Cases

- In the **“Fälle filtern”** section (Step 3), you can:
  - Exclude cases without sequence data
  - Filter cases by genetic distance (threshold)
  - Define a date range and exclude cases outside that range

These filters determine which nodes (cases) appear in the visualization.  
Cases from the selected outbreak are always visible and not affected by filters.

### 4. Display Contact Tracing

- Enable **“Kontaktkanten anzeigen”** to visualize epidemiological connections between cases.
- This view helps you identify **potential transmission pathways**.

### 5. Coloring and Visualization

- In the **Einfärbung** section, choose how nodes are colored:
  - By **Zeitspanne** (temporal coloring based on registration date)
  - By **Ausbrüchen** (outbreak-based coloring)

When coloring by outbreaks, you can decide whether the currently analyzed outbreak or surrounding outbreaks should be highlighted.  
You can also click the color button to adjust the color scheme interactively.

### 6. Use the Visualization

- Click a node in the graph to view **case details**.  
  If genetic distances exist to other nodes below the distance threshold, **red dashed edges** are displayed.  
  This helps reveal **potential connections between cases** that would otherwise remain hidden in the **Minimum Spanning Tree**, where each case is connected by only one edge.

- Use **zoom** and **pan** controls to focus on specific areas.
- The **legend** provides an overview of all current colors and symbols.

### 7. Export PDF Report

- Click **“Ausbruchsanalyse-Report exportieren”** to create a report of the current analysis.  
  The report includes a summary of the outbreak scenario, an **automatically generated assessment**, and a figure of the visualization with indexed cases.
- You can customize the report during creation.
- Once generated, the report will be downloaded as a **PDF file**.

### 8. Save and Exit

- When you have finished your analysis, click **“Analyse speichern und beenden”** (at the bottom of the sidebar) to save your work and return to the overview.

---

## Additional Features

- **Auto-Save:** The analysis is automatically saved in the background.

---

## Tips and Troubleshooting

**No outbreaks visible:**

- Check in the overview whether outbreaks exist or whether filters are set too restrictively.  
  The graph can only be generated if valid outbreak data is available.

---

## Frequently Asked Questions (FAQ)

**What is the difference between “Outbreak” and “Background”?**

- “Outbreak” refers to cases that have been assigned to a predefined outbreak.  
  This can occur during data import, through data management, or via clustering in the dashboard.
- “Background” refers to additional cases (e.g., other outbreaks or groups) that can be displayed as contextual information.

**How can I save my view?**

- Use **“Save and Exit Analysis”** or enable **Auto-Save**.  
  Additionally, you can export your local application state using **Save State** for backup purposes.

---
