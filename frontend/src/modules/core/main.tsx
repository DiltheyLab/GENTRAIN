import React, { useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "@/modules/dashboard/pages/Dashboard.tsx";
import "@/modules/core/index.css";
import { Error } from "@/modules/core/pages/Error.tsx";
import { DataManagement } from "@/modules/data_management/pages/DataManagement.tsx";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import translation_de from "@/modules/core/translations/de/common.json";
import import_de from "@/modules/core/translations/de/import.json";
import error_de from "@/modules/core/translations/de/error.json";
import { Toaster } from "@/modules/core/components/ui/Toaster.tsx";
import { OutbreakAnalysisOverview } from "@/modules/outbreak_analysis/pages/OutbreakAnalysisOverview";
import { useCoreStore } from "@/modules/core/stores/core.ts";
import { OutbreakAnalysis } from "@/modules/outbreak_analysis/pages/OutbreakAnalysis.tsx";
import {
    fetchPathogensFromServer,
    getAllPathogensWithRelationships,
    PathogenWithRelationships,
} from "@/modules/core/models/pathogens.ts";
import { Onboarding } from "@/modules/core/pages/Onboarding";
import { RefreshLoader } from "./components/ui/RefreshLoader";
import { useHandlePersistedSessionResults } from "@/modules/data_management/hooks/useHandlePersistedSessionResults";
import { db } from "./infrastructure/database";

i18next.init({
    interpolation: { escapeValue: false },
    lng: "de",
    resources: {
        de: { translation: translation_de, import: import_de, error: error_de },
    },
});

const App = () => {
    const session = useCoreStore((state) => state.session);
    const fetchSession = useCoreStore((state) => state.fetchSession);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const updateActivePathogen = useCoreStore((state) => state.updateActivePathogen);

    useHandlePersistedSessionResults();

    useEffect(() => {
        fetchSession();
        fetchPathogensFromServer().then((pathogensServerStorage) => {
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
        });
    }, []);

    if (session === undefined) {
        return <RefreshLoader />;
    }

    if (session === null || !activePathogen) {
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
        { path: "/outbreak-analysis/:name", element: <OutbreakAnalysis />, errorElement: <Error /> },
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
