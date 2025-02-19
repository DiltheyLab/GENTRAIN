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
import { OutbreakAnalysis } from "@/modules/outbreak_analysis/pages/OutbreakAnalysis.tsx";
import { Root } from "@/modules/core/Root";
import { Impress } from "@/modules/core/pages/Impress";
import { Contact } from "@/modules/core/pages/Contact";
import { DataPrivacy } from "@/modules/core/pages/DataPrivacy";
import { PostHogProvider } from "posthog-js/react";
import { PostHogConfig } from "posthog-js";

const postHogProviderOptions: Partial<PostHogConfig> = {
    api_host: import.meta.env.VITE_APP_PUBLIC_POSTHOG_HOST,
    session_recording: {
        maskAllInputs: false,
    },
};

i18next.init({
    interpolation: { escapeValue: false },
    lng: "de",
    resources: {
        de: { translation: translation_de, import: import_de, error: error_de },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,
        children: [
            { path: "/", element: <Dashboard /> },
            { path: "/impress", element: <Impress /> },
            { path: "/data-privacy", element: <DataPrivacy /> },
            { path: "/contact", element: <Contact /> },
            { path: "/outbreak-analysis", element: <OutbreakAnalysisOverview /> },
            { path: "/outbreak-analysis/:name", element: <OutbreakAnalysis /> },
            { path: "/data-management", element: <DataManagement /> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <I18nextProvider i18n={i18next}>
        <Toaster />
        <PostHogProvider apiKey={import.meta.env.VITE_APP_PUBLIC_POSTHOG_KEY} options={postHogProviderOptions} />
        <RouterProvider router={router} />
    </I18nextProvider>
);
