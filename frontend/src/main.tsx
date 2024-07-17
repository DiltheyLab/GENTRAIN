import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard.tsx";
import "./index.css";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import { DataUpload } from "./pages/DataUpload.tsx";
import "@/assets/css/main.css";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import translation_de from "@/translations/de/common.json";
import error_de from "@/translations/de/error.json";

import { Toaster } from "./components/ui/toaster.tsx";
import { PathogenDialog } from "./components/dataUpload/PathogenDialog.tsx";

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
        errorElement: <ErrorPage />,
        element: <Dashboard />,
    },
    {
        path: "/data-upload",
        errorElement: <ErrorPage />,
        element: <DataUpload />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <Toaster />
            <RouterProvider router={router} />
            <PathogenDialog />
        </I18nextProvider>
    </React.StrictMode>
);
