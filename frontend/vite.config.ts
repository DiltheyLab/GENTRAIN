/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    envDir: process.env.NODE_ENV === 'development' ? "../" : "./",
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
