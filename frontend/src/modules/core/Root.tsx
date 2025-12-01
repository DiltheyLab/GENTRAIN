import { Outlet } from "react-router-dom";
import { useHandlePersistedSequenceAnalysisResults } from "../data_management/hooks/useHandlePersistedSequenceAnalysisResults";
import { TutorialTour } from "../tutorial/components/TutorialTour";
import { Onboarding } from "./pages/Onboarding";
import { useCoreStore } from "./stores/core";
import { Layout } from "./components/layout/Layout";
import { PathogenSelectionDialog } from "./components/PathogenSelectionDialog";
import { useTutorialStore } from "../tutorial/stores/tutorial";
import { useSyncPathogensBetweenServerAndClient } from "./hooks/useSyncPathogensBetweenServerAndClient";
import { useDatabaseDeletion } from "./hooks/database/useDatabaseDeletion";
import { MobileBlocker } from "./components/layout/MobileBlocker";
import { LoadingBlocker } from "./components/layout/LoadingBlocker";

export const Root = () => {
    const sessionId = useCoreStore((state) => state.sessionId);
    const tutorialTourIsActive = useTutorialStore((state) => state.tutorialTourIsActive);

    useHandlePersistedSequenceAnalysisResults();
    useSyncPathogensBetweenServerAndClient();
    useDatabaseDeletion();

    if (!sessionId) {
        return <Onboarding />;
    }

    return (
        <>
            <MobileBlocker />
            <LoadingBlocker />
            <PathogenSelectionDialog />
            {tutorialTourIsActive && <TutorialTour />}
            <Layout>
                <Outlet />
            </Layout>
        </>
    );
};
