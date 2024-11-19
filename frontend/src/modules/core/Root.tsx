import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useHandlePersistedSessionResults } from "../data_management/hooks/useHandlePersistedSessionResults";
import { TutorialTour } from "./components/tutorial/TutorialTour";
import { RefreshLoader } from "./components/ui/RefreshLoader";
import {
    fetchPathogensFromServer,
    getAllPathogensWithRelationships,
    PathogenWithRelationships,
} from "./models/pathogens";
import { Onboarding } from "./pages/Onboarding";
import { useCoreStore } from "./stores/core";
import { Layout } from "./components/layout/Layout";
import { PathogenTypeName } from "@/core/models/pathogen_types.ts";
import { db } from "@/modules/core/infrastructure/database.ts";
import { mouseflow } from "react-mouseflow";

export const Root = () => {
    const session = useCoreStore((state) => state.session);
    const fetchSession = useCoreStore((state) => state.fetchSession);
    const updateActivePathogen = useCoreStore((state) => state.updateActivePathogen);
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    useHandlePersistedSessionResults();

    useEffect(() => {
        mouseflow.initialize("");
    }, []);

    useEffect(() => {
        fetchSession();
        fetchPathogensFromServer().then(
            (
                pathogensServerStorage: {
                    id: number;
                    name: string;
                    type: PathogenTypeName;
                    genetic_distance_threshold: number;
                }[]
            ) => {
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
                });
            }
        );
    }, []);

    if (session === undefined) {
        return <RefreshLoader />;
    }

    if (session === null) {
        return <Onboarding />;
    }

    return (
        <>
            {tutorialTourIsActive && <TutorialTour />}
            <Layout>
                <Outlet />
            </Layout>
        </>
    );
};
