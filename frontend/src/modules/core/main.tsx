import React, { useEffect } from "react";
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
import { PathogenDialog } from "@/modules/core/components/ui/PathogenDialog.tsx";
import { getAllPathogensWithRelationships, PathogenWithRelationships } from "@/modules/core/models/pathogens.ts";

i18next.init({
    interpolation: { escapeValue: false },
    lng: "de",
    resources: {
        de: { translation: translation_de, error: error_de },
    },
});

const App = () => {
    //vll nur die slices laden, die benötigt werden anstatt den ganzen store zu obverven
    const { session, fetchSession, updateActivePathogen } = useCoreStore();

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
        return <div>Loading...</div>;
    }

    if (session === null) {
        return <PathogenDialog />; //Ersetzen durch On-Boarding
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
