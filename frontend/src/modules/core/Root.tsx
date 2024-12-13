import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useHandlePersistedSessionResults } from "../data_management/hooks/useHandlePersistedSessionResults";
import { TutorialTour } from "./components/tutorial/TutorialTour";
import { RefreshLoader } from "./components/ui/RefreshLoader";
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

export const Root = () => {
    const sessionId = useCoreStore((state) => state.sessionId);
    const fetchSession = useCoreStore((state) => state.fetchSession);
    const updateActivePathogen = useCoreStore((state) => state.updateActivePathogen);
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    const setPathogenIsLoading = useCoreStore((state) => state.setPathogenIsLoading);

    useHandlePersistedSessionResults();

    const posthog = usePostHog();

    useEffect(() => {
        fetchSession();
    }, []);

    useEffect(() => {
        if (!sessionId) return;

        posthog?.identify(sessionId, { sessionID: sessionId });
        console.log("Posthog User-ID:", posthog.get_distinct_id());
    }, [posthog, sessionId]);

    useEffect(() => {
        setPathogenIsLoading(true);
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
                            genetic_distance_threshold: pathogenServer.genetic_distance_threshold,
                            pathogen_type_id: pathogenType.id,
                        });
                    } else {
                        db.pathogens.add({
                            id: pathogenServer.id,
                            name: pathogenServer.name,
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

    if (sessionId === undefined) {
        return <RefreshLoader />;
    }

    if (sessionId === null) {
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
