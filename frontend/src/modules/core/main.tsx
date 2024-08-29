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
import { getAllPathogensWithRelationships, PathogenWithRelationships } from "@/modules/core/models/pathogens.ts";
import { Cookies } from "react-cookie";
import { socket } from "@/modules/core/helpers/socket";
import { Onboarding } from "@/modules/core/pages/Onboarding";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { Share2 } from "lucide-react";

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
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center">
                <LoadingSpinner width={50} height={50} />
                <div className="flex items-center text-primary mt-8">
                    <Share2 className="w-14 h-14 mr-2" /> <span className="text-[50px]">Gentrain</span>
                </div>
            </div>
        );
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

const cookies = new Cookies();
const roomIdentifier = cookies.get("gentrain_room") ?? Math.random().toString(16).slice(2);
socket.emit("join", roomIdentifier);
socket.on("room_created", (roomIdentifier) => {
    cookies.set("gentrain_room", roomIdentifier);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <Toaster />
            <App />
        </I18nextProvider>
    </React.StrictMode>
);
