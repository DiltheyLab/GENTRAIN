import React, { useEffect, useMemo } from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "@/modules/dashboard/pages/Dashboard.tsx";
import "@/modules/core/index.css";
import { Error } from "@/modules/core/pages/Error.tsx";
import { DataManagement } from "@/modules/data_management/pages/DataManagement.tsx";
import "@/assets/css/main.css";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import translation_de from "@/modules/core/translations/de/common.json";
import error_de from "@/modules/core/translations/de/error.json";
import { Toaster } from "@/modules/core/components/ui/Toaster.tsx";
import { OutbreakAnalysisOverview } from "@/modules/outbreak_analysis/pages/OutbreakAnalysisOverview";
import { useCoreStore } from "@/modules/core/stores/core.ts";
import { Analysis } from "@/modules/outbreak_analysis/pages/OutbreakAnalysis.tsx";
import { getAllPathogensWithRelationships, PathogenWithRelationships } from "@/modules/core/models/pathogens.ts";
import { Onboarding } from "@/modules/core/pages/Onboarding";
import { RefreshLoader } from "./components/ui/RefreshLoader";
import { useHandlePersistedSessionResults } from "@/modules/data_management/hooks/useHandlePersistedSessionResults";

i18next.init({
    interpolation: { escapeValue: false },
    lng: "de",
    resources: {
        de: { translation: translation_de, error: error_de },
    },
});

const App = () => {
    const session = useCoreStore((state) => state.session);
    const fetchSession = useCoreStore((state) => state.fetchSession);
    const updateActivePathogen = useCoreStore((state) => state.updateActivePathogen);

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

    const router = createBrowserRouter([
        {
            path: "/",
            errorElement: <Error />,
            element: <Dashboard />,
        },
        {
            path: "/outbreak-analysis",
            errorElement: <Error />,
            element: <OutbreakAnalysisOverview />,
        },
        { path: "/outbreak-analysis/:name", element: <Analysis />, errorElement: <Error /> },
        {
            path: "/data-management",
            errorElement: <Error />,
            element: <DataManagement />,
        },
    ]);

    return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <Toaster />
            <App />
        </I18nextProvider>
    </React.StrictMode>
);
