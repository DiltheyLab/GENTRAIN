# ISGA Import

Öffnen Sie das Hauptmenü (oben links) und klicken Sie auf „Infektionsschutz“, dann „Meldepflichtige Erkrankungen“ und schließlich auf „Person“. Unter dem Menüpunkt „Dienste“ finden Sie dann „Auswertung“, klicken Sie hier auf „Auswertung CSV“. Im Anschluss sollte sich folgendes Menü öffnen: 

![Auswertung CSV](/img/application/export/ISGA_AuswertungCSV.png "Auswertung CSV")

Klicken Sie nun neben dem Drop-down- / Aufklappmenü mit der Bezeichnung „Profil“ auf das Symbol einer Mappe mit Plus-Zeichen. Es öffnet sich nun eine andere Ansicht mit vier Registerkarten, „Name / Vorlage“, „Felder“, „Filter“ und „Code“. Unter „Name / Vorlage“ können Sie Ihrem neuen Auswertungsprofil einen Namen geben:

![Auswertungsprofil](/img/application/export/ISGA_Auswertungsprofil.png "Auswertungsprofil")

Unter „Felder“ können Sie die für die Abfrage gewünschten Informationen angeben:

![Felder](/img/application/export/ISGA_Felder.png "Felder")

Im Fall von GENTRAIN wählen Sie bitte die folgenden Felder für Ihre Abfrage aus:
fallFallkennzeichen, fallMeldedatum, ausbruchAktenzeichen, ausbruchId, persName, persVorname, persGeburtsdatum, persOrt, persStrasse, persHnr

Schließlich können Sie noch unter „Filter“ Bedingungen für die genauere Auswahl der Daten angeben. Hier sollte in den allermeisten Anwendungsszenarien von GENTRAIN eine Filterung nach Krankheitsart vorgenommen werden, beispielsweise COVID-19:

![Krankheitsauswahl](/img/application/export/ISGA_Krankheitsauswahl.png "Krankheitsauswahl")

Eine zeitliche Filterung auf Basis der Meldedaten bietet sich in vielen Szenarien ebenfalls an. Sind Felder und Filter ausgewählt, so können Sie die Abfrage mit den unten rechts im Fenster befindlichen Knöpfen abspeichern und ausführen. Die resultierende CSV-Datei lässt sich dann bequem über das Webinterface von GENTRAIN hochladen.