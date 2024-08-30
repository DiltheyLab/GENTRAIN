import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_HOST, {
    transports: ["websocket"],
    extraHeaders: {
        Authorization:
            "Basic " + btoa(`${import.meta.env.VITE_HTBASIC_USERNAME}:${import.meta.env.VITE_HTBASIC_PASSWORD}`),
    },
});
