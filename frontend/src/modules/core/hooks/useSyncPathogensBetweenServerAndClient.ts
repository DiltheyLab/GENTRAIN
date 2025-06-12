import { useEffect } from "react";
import { useCoreStore } from "../stores/core";
import { getAllPathogensWithRelationships, PathogenWithRelationships } from "../models/pathogens";
import { getAllPathogenTypes } from "../models/pathogen_types";
import { db } from "../services/database/DatabaseManager";
import { useTutorialStore } from "@/modules/tutorial/stores/tutorial";
import { useToast } from "../components/ui/UseToast";
import gentrainApiInstance from "../adapters/GentrainApi";

export const useSyncPathogensBetweenServerAndClient = () => {
    const updateActivePathogen = useCoreStore((state) => state.updateActivePathogen);
    const setPathogenIsLoading = useCoreStore((state) => state.setPathogenIsLoading);
    const tutorialTourIsActive = useTutorialStore((state) => state.tutorialTourIsActive);
    const { toast } = useToast();

    useEffect(() => {
        if (tutorialTourIsActive) return; // don't fetch pathogens from the backend if you are in the tutorial mode
        setPathogenIsLoading(true);

        const syncPathogensBetweenServerAndClient = async () => {
            try {
                // fetch pathogens from the server and client database and pathogen types
                const [pathogensFromServerDB, pathogensFromClientDB, pathogenTypes] = await Promise.all([
                    gentrainApiInstance.getPathogensFromServer(),
                    getAllPathogensWithRelationships(),
                    getAllPathogenTypes(),
                ]);

                // if the pathogens could not be fetched, return
                if (!pathogensFromServerDB) {
                    return;
                }

                // check if the server and client databases have the same pathogens
                const pathogenIDsFromServer = pathogensFromServerDB.map((pathogen) => pathogen.id);
                const pathogenIDsFromClient = pathogensFromClientDB.map((pathogen) => pathogen.id);
                const pathogenIDsToDelete = new Set(
                    pathogenIDsFromClient.filter((pathogenID) => !pathogenIDsFromServer.includes(pathogenID))
                );

                // Delete pathogens that were in the client DB but not in the server DB
                const idsToDelete = [...pathogenIDsToDelete];
                if (idsToDelete.length > 0) {
                    await db.pathogens.bulkDelete(idsToDelete);
                }

                // Add or update pathogens from the server database to the client database
                for (const pathogenFromServerDB of pathogensFromServerDB) {
                    // check if the pathogen type exists in the client database
                    const pathogenType = pathogenTypes.find(
                        (pathogenType) => pathogenType.name === pathogenFromServerDB.type
                    );

                    // if the pathogen type does not exist, skip this pathogen
                    if (!pathogenType) {
                        continue;
                    }

                    // check if the pathogen already exists in the client database
                    const pathogenExistsInClientStorage = pathogensFromClientDB.find(
                        (pathogenClient) => pathogenClient.id === pathogenFromServerDB.id
                    );

                    // if the pathogen exists in the client database, update it else add it
                    if (pathogenExistsInClientStorage) {
                        db.pathogens.update(pathogenFromServerDB.id, {
                            name: pathogenFromServerDB.name,
                            cases_example: pathogenFromServerDB.cases_example,
                            sequences_example: pathogenFromServerDB.sequences_example,
                            contacts_example: pathogenFromServerDB.contacts_example,
                            genetic_distance_threshold: pathogenFromServerDB.genetic_distance_threshold,
                            pathogen_type_id: pathogenType.id,
                        });
                    } else {
                        db.pathogens.add({
                            id: pathogenFromServerDB.id,
                            name: pathogenFromServerDB.name,
                            cases_example: pathogenFromServerDB.cases_example,
                            sequences_example: pathogenFromServerDB.sequences_example,
                            contacts_example: pathogenFromServerDB.contacts_example,
                            genetic_distance_threshold: pathogenFromServerDB.genetic_distance_threshold,
                            pathogen_type_id: pathogenType.id,
                            activated_at: null,
                        });
                    }
                }

                // Re-fetch the data to get the correct state after changes
                const updatedClientPathogens = await getAllPathogensWithRelationships();

                const activelyPersistedPathogen = updatedClientPathogens.find(
                    (pathogen: PathogenWithRelationships) => pathogen.activated_at
                );

                updateActivePathogen(activelyPersistedPathogen ?? null);
            } catch (error) {
                console.error("Error syncing pathogens between server and client:", error);
                toast({
                    title: "Pathogene konnte nicht synchronisiert werden",
                    description: `Es gab einen Fehler beim Synchronisieren der Pathogene zwischen dem Server und dem Client. Bitte versuchen Sie es später erneut.`,
                    variant: "destructive",
                    duration: 5000,
                });
            } finally {
                setPathogenIsLoading(false);
            }
        };

        syncPathogensBetweenServerAndClient();
    }, []);
};
