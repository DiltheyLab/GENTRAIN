import { io } from "socket.io-client";
import { useCoreStore } from "../stores/core";
import { GentrainException } from "../exceptions/GentrainException";
import { v4 as uuidv4 } from "uuid";

type WebsocketEvent = "sequence_analysis_response" | "sequence_analysis_enqueued" | "sequence_analysis_started";

export class GentrainWebsocket {
    private client;
    private username: string = `${import.meta.env.VITE_API_BASIC_USERNAME}`;
    private password: string = `${import.meta.env.VITE_API_BASIC_PASSWORD}`;

    constructor() {
        this.client =
            import.meta.env.VITE_ENABLE_WEBSOCKETS === "true" &&
            io(import.meta.env.VITE_API_HOST, {
                transports: ["websocket"],
                extraHeaders: {
                    Authorization: "Basic " + btoa(`${this.username}:${this.password}`),
                },
            });
    }

    // Room Management

    public async joinRoom(pathogenTypeName: string, callback: (roomName: string) => void) {
        if (!this.client) {
            throw new GentrainException("InvalidWebsocketClient");
        }
        this.client.emit("join_sequence_analysis_room", useCoreStore.getState().sessionId, pathogenTypeName);
        this.client.once(`${pathogenTypeName}_room_created`, async (roomName: string) => {
            callback(roomName);
        });
    }

    public async leaveRoom(pathogenTypeName: string) {
        if (!this.client) {
            throw new GentrainException("InvalidWebsocketClient");
        }
        this.client.emit("leave_sequence_analysis_room", pathogenTypeName);
    }

    public sequenceAnalysisEmit(pathogenId: number, fastaString: string, fastaHash: string | null = null) {
        if (!this.client) {
            throw new GentrainException("InvalidWebsocketClient");
        }
        const chunkingId = uuidv4();
        const fastaChunks = fastaString.match(/(.|[\r\n]){1,500000}/g) ?? [];
        for (const index in fastaChunks) {
            const chunkInformation = {
                id: chunkingId,
                total: fastaChunks.length,
                index: parseInt(index),
            };
            this.client.emit("sequence_analysis", fastaChunks[index], chunkInformation, pathogenId, fastaHash);
        }
    }

    // Listener Management
    public async listenForEvent(event: WebsocketEvent, callback: (data: any) => void) {
        if (!this.client) {
            throw new GentrainException("InvalidWebsocketClient");
        }
        this.client.on(event, (data) => callback(data));
    }

    public stopListenForEvent(event: WebsocketEvent) {
        if (!this.client) {
            throw new GentrainException("InvalidWebsocketClient");
        }
        this.client.off(event);
    }
}

const gentrainWebsocketInstance = new GentrainWebsocket();
export default gentrainWebsocketInstance;
