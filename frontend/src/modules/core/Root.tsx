import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useHandlePersistedSessionResults } from "../data_management/hooks/useHandlePersistedSessionResults";
import { TutorialTour } from "../tutorial/components/TutorialTour";
import {
    fetchPathogensFromServer,
    getAllPathogensWithRelationships,
    Pathogen,
    PathogenWithRelationships,
} from "./models/pathogens";
import { Onboarding } from "./pages/Onboarding";
import { useCoreStore } from "./stores/core";
import { Layout } from "./components/layout/Layout";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { usePostHog } from "posthog-js/react";
import { PathogenSelectionDialog } from "./components/PathogenSelectionDialog";
import { useTutorialStore } from "../tutorial/stores/tutorial";

export const Root = () => {
    const sessionId = useCoreStore((state) => state.sessionId);
    const updateActivePathogen = useCoreStore((state) => state.updateActivePathogen);
    const tutorialTourIsActive = useTutorialStore((state) => state.tutorialTourIsActive);
    const setPathogenIsLoading = useCoreStore((state) => state.setPathogenIsLoading);

    useHandlePersistedSessionResults();

    const posthog = usePostHog();

    useEffect(() => {
        if (!sessionId) return;

        posthog?.identify(sessionId, { sessionID: sessionId });
        console.log("Posthog User-ID:", posthog.get_distinct_id());
    }, [posthog, sessionId]);

    useEffect(() => {
        if (tutorialTourIsActive) return; // don't fetch pathogens from the backend if you are in the tutorial mode
        setPathogenIsLoading(true);
        // TODO: replace with optimized implementation
        fetchPathogensFromServer().then((pathogensServerStorage: Pathogen[]) => {
            getAllPathogensWithRelationships().then(async (pathogensClientStorage) => {
                let pathogensToDelete = pathogensClientStorage;
                for (const pathogenServer of pathogensServerStorage) {
                    const pathogenType = await db.pathogen_types.where({ name: pathogenServer.type }).first();
                    if (!pathogenType) {
                        continue;
                    }
                    const pathogenExistsInClientStorage =
                        pathogensClientStorage.filter((pathogenClient) => pathogenClient.id === pathogenServer.id)
                            .length > 0;
                    if (pathogenExistsInClientStorage) {
                        db.pathogens.update(pathogenServer.id, {
                            name: pathogenServer.name,
                            cases_example: pathogenServer.cases_example,
                            sequences_example: pathogenServer.sequences_example,
                            contacts_example: pathogenServer.contacts_example,
                            genetic_distance_threshold: pathogenServer.genetic_distance_threshold,
                            pathogen_type_id: pathogenType.id,
                        });
                    } else {
                        db.pathogens.add({
                            id: pathogenServer.id,
                            name: pathogenServer.name,
                            cases_example: pathogenServer.cases_example,
                            sequences_example: pathogenServer.sequences_example,
                            contacts_example: pathogenServer.contacts_example,
                            genetic_distance_threshold: pathogenServer.genetic_distance_threshold,
                            pathogen_type_id: pathogenType.id,
                            activated_at: null,
                        });
                    }
                    pathogensToDelete = pathogensToDelete.filter(
                        (pathogenClient) => pathogenClient.id !== pathogenServer.id
                    );
                }
                // delete unhandled pathogens
                for (const pathogenToDelete of pathogensToDelete) {
                    db.pathogens.delete(pathogenToDelete.id);
                }

                const activelyPersistedPathogen = pathogensClientStorage.find(
                    (pathogen: PathogenWithRelationships) => pathogen.activated_at
                );

                updateActivePathogen(activelyPersistedPathogen ?? null);
                setPathogenIsLoading(false);
            });
        });
    }, []);

    if (!sessionId) {
        return <Onboarding />;
    }

    return (
        <>
            <PathogenSelectionDialog />
            {tutorialTourIsActive && <TutorialTour />}
            <Layout>
                <Outlet />
            </Layout>
        </>
    );
};
