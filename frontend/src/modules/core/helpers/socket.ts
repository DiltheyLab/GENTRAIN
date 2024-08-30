import { io } from "socket.io-client";

export const socket =
    import.meta.env.VITE_ENABLE_WEBSOCKETS === "true" &&
    io(import.meta.env.VITE_API_HOST, {
        transports: ["websocket"],
        extraHeaders: {
            Authorization:
                "Basic " + btoa(`${import.meta.env.VITE_HTBASIC_USERNAME}:${import.meta.env.VITE_HTBASIC_PASSWORD}`),
        },
    });
