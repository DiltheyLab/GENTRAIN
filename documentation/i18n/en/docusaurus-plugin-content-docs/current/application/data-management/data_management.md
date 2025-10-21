---
id: general
title: General
sidebar_label: General
sidebar_position: 1
---

# General

On the **Datenverwaltung** page, you manage the local case data for the currently selected pathogen.  
Here, you can import cases, sequences, and contact person data, view an overview of existing data, delete data selectively, or create outbreaks.

The page is divided into three main sections:

- **Import Area:** Upload new data (cases, sequences, contact person data)
- **Data Overview:** Overview of all imported cases, outbreaks, and groups, including editing and deletion options
- **Data Deletion:** Settings for automatic deletion (TTL), temporary storage, and manual deletion of the entire local database

---

## Datenimport

In the **Import Area**, you can upload three types of data:

- **Falldaten (CSV):** Basic information about cases (e.g., ID, date, location, outbreak assignment)
- **Sequenzdaten (FASTA):** Sequence data for each case
- **Kontaktpersonendaten (CSV):** Epidemiological information between cases from the KoNa tool, e.g., **“angesteckt bei”**

:::info Important Notes

- **Sequenzdaten** and **Kontaktpersonendaten** imports are only available if **Falldaten** for the active pathogen already exist. Please import **Falldaten** first.
- Use the format expected by GENTRAIN. If you are unsure, you can use the **exemplarische Falldaten** provided below the import boxes.
  :::

**Steps for Import:**

1. Select the appropriate import box (**Falldaten**, **Sequenzdaten**, or **Kontaktpersonendaten**) and either drag the corresponding file into the drop zone or upload it via the relevant button (e.g., **Falldaten hochladen**).
2. Use the selection tables that appear to decide which entries to include.
3. Confirm the import. A confirmation message will appear in the app upon success.

> Tip: Use the **Import-Assistent**, if you want to be guided step by step through the import process.

---

## Import Wizard (Step-by-Step)

The **Import-Assistent** assists you in uploading data:

- It shows which files are required and in what order (**Falldaten** first, then **Sequenzdaten** and **Kontaktpersonendaten**)
- It provides a preview of recognized datasets and explains the files
- You can select which datasets to import using checkboxes

The wizard is particularly helpful if you are unsure about the data format.

---

## Data Overview

The **Data Overview** displays all imported entries for the currently selected pathogen:

- **Falldaten:** List of all cases with details; entries can be searched and filtered
- **Ausbrüche:** List of outbreaks with case counts; you can assign **Falldaten** to outbreaks or create new outbreaks
- **Gruppen:** Categorized groups (e.g., vaccination status) with associated case counts

---

## Data Deletion & TTL (Automatic Deletion)

GENTRAIN offers options to manage the lifespan of local data:

- **Standard TTL:** The local database has a default lifespan (e.g., 24 hours). After expiration, it is automatically deleted.
- **Flüchtige Speicherung (Delete on Exit):** When enabled, data is only retained for the current session and is removed when the browser is reloaded or closed.
- **Manual Deletion:** Using **„Alle Daten löschen“**, you can immediately and permanently clear the local database.

> Note: If automatic deletion is triggered while the app is not open, deletion will occur automatically on the next start.

---

## Tipps zur Nutzung

- Import order: first **Falldaten**, then **Sequenzdaten**, finally **Kontaktpersonendaten**
- Check the selection tables before finalizing the import: entries can be included or excluded
- Use search and filter functions in the tables to quickly locate specific datasets
- Refer to the **exemplarische Falldaten**, if you are unsure about the data format

---

## Fehlerbehebung

**Import Errors:**

- Check whether the file is in the correct format. Errors are displayed in the app
- If an import fails, try smaller files or check for missing required fields

---

## FAQ

**Where is the data stored?**

- The data is stored locally in your browser (IndexedDB). It is only available on your device and in the browser in which it was imported. **We do not send any personal data to external servers.**

**How secure is GENTRAIN?**

- GENTRAIN has been audited by an external service provider according to modern security standards. However, please note that the application runs locally in the browser, so the security of your data also depends on the security of your device and browser.

---
