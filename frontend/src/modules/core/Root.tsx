import { Outlet } from "react-router-dom";
import { useHandlePersistedSessionResults } from "../data_management/hooks/useHandlePersistedSessionResults";
import { TutorialTour } from "../tutorial/components/TutorialTour";
import { Onboarding } from "./pages/Onboarding";
import { useCoreStore } from "./stores/core";
import { Layout } from "./components/layout/Layout";
import { PathogenSelectionDialog } from "./components/PathogenSelectionDialog";
import { useTutorialStore } from "../tutorial/stores/tutorial";
import { useSyncPathogensBetweenServerAndClient } from "./hooks/useSyncPathogensBetweenServerAndClient";

export const Root = () => {
    const sessionId = useCoreStore((state) => state.sessionId);
    const tutorialTourIsActive = useTutorialStore((state) => state.tutorialTourIsActive);

    useHandlePersistedSessionResults();
    useSyncPathogensBetweenServerAndClient();

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
