import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "../dashboard/pages/Dashboard.tsx";
import "./index.css";
import { Error } from "./pages/Error.tsx";
import { DataManagement } from "../data_management/pages/DataManagement.tsx";
import "@/assets/css/main.css";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import translation_de from "@/translations/de/common.json";
import error_de from "@/translations/de/error.json";

import { Toaster } from "./components/ui/Toaster.tsx";
import { OutbreakAnalysisSelection } from "../outbreak_analysis/pages/OutbreakAnalysisSelection.tsx";
import { PathogenDialog } from "./components/dataUpload/PathogenDialog.tsx";
import { useCoreStore } from "./stores/core.ts";
import { getAllPathogensWithRelationships, PathogenWithRelationships } from "./database/pathogens.ts";
import { Analysis } from "../outbreak_analysis/pages/OutbreakAnalysis.tsx";

i18next.init({
    interpolation: { escapeValue: false },
    lng: "de",
    resources: {
        de: { translation: translation_de, error: error_de },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Error />,
        element: <Dashboard />,
    },
    {
        path: "/outbreak-analysis",
        errorElement: <Error />,
        element: <OutbreakAnalysisSelection />,
    },
    { path: "/outbreak-analysis/:name", element: <Analysis />, errorElement: <Error /> },
    {
        path: "/data-upload",
        errorElement: <Error />,
        element: <DataManagement />,
    },
]);

getAllPathogensWithRelationships().then((response) => {
    const activelyPersistedPathogen = response.find((pathogen: PathogenWithRelationships) => pathogen.activated_at);
    if (activelyPersistedPathogen) {
        useCoreStore.getState().updateActivePathogen(activelyPersistedPathogen);
    }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <Toaster />
            <RouterProvider router={router} />
            <PathogenDialog />
        </I18nextProvider>
    </React.StrictMode>
);
