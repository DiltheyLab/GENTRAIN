/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), basicSsl()],
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        coverage: {
            reporter: ["text", "html", "json-summary", "json"],
            /*  thresholds: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80,
            }, */
        },
        environment: "jsdom",
    },
});
