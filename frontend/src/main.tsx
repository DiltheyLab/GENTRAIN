import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard.tsx";
import "./index.css";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import { DataUpload } from "./pages/DataUpload.tsx";
import "@/assets/css/main.css";

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
        <RouterProvider router={router} />
    </React.StrictMode>
);
