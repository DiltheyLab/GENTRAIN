import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useHandlePersistedSessionResults } from "../data_management/hooks/useHandlePersistedSessionResults";
import { TutorialTour } from "./components/tutorial/TutorialTour";
import { RefreshLoader } from "./components/ui/RefreshLoader";
import { getAllPathogensWithRelationships, PathogenWithRelationships } from "./models/pathogens";
import { Onboarding } from "./pages/Onboarding";
import { useCoreStore } from "./stores/core";
import { Layout } from "./components/layout/Layout";

export const Root = () => {
    const session = useCoreStore((state) => state.session);
    const fetchSession = useCoreStore((state) => state.fetchSession);
    const updateActivePathogen = useCoreStore((state) => state.updateActivePathogen);
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    useHandlePersistedSessionResults();

    useEffect(() => {
        fetchSession();
        getAllPathogensWithRelationships().then((response) => {
            const activelyPersistedPathogen = response.find(
                (pathogen: PathogenWithRelationships) => pathogen.activated_at
            );

            if (activelyPersistedPathogen) {
                updateActivePathogen(activelyPersistedPathogen);
            }
        });
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
