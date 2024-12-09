import { io } from "socket.io-client";
import { useCoreStore } from "../stores/core";
import { GentrainException } from "../exceptions/GentrainException";

export class GentrainWebsocket {
    private client;

    constructor() {
        this.client =
            import.meta.env.VITE_ENABLE_WEBSOCKETS === "true" &&
            io(import.meta.env.VITE_API_HOST, {
                transports: ["websocket"],
                extraHeaders: {
                    Authorization:
                        "Basic " +
                        btoa(`${import.meta.env.VITE_HTBASIC_USERNAME}:${import.meta.env.VITE_HTBASIC_PASSWORD}`),
                },
            });
    }

    // Room Management

    public async joinRoom(pathogenTypeName: string, callback: (roomName: string) => void) {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.emit(`join_${pathogenTypeName}`, useCoreStore.getState().session?.id);
        this.client.once(`${pathogenTypeName}_room_created`, async (roomName: string) => {
            console.log(`Room ${roomName} was joined.`);
            callback(roomName);
        });
    }

    public async leaveRoom(pathogenTypeName: string) {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.emit(`leave_${pathogenTypeName}`);
    }

    // Message Emit Management

    public async emitSequenceAnalysis(pathogenId: number, sequenceIdentifier: string, sequence: string) {
        if (!this.client) {
            throw new GentrainException("");
        }
        const sequenceChunks = sequence.match(/(.|[\r\n]){1,500000}/g) ?? [];
        for (const index in sequenceChunks) {
            const chunkInformation = {
                total: sequenceChunks.length,
                index: parseInt(index),
            };
            this.client.emit(
                "sequence_analysis_request",
                pathogenId,
                sequenceIdentifier,
                sequenceChunks[index],
                chunkInformation
            );
        }
    }

    // Listener Management

    public async listenForSequenceAnalysisResponse(callback: (data: any) => void) {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.on("sequence_analysis_response", (data) => callback(data));
    }

    public async listenForSequenceAnalysisEnqueued(callback: (data: any) => void) {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.on("sequence_analysis_enqueued", (data) => callback(data));
    }

    public async listenForSequenceAnalysisFailed(callback: (data: any) => void) {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.on("sequence_analysis_failed", (data) => callback(data));
    }

    public async listenForSequenceAnalysisStarted(callback: (data: any) => void) {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.on("sequence_analysis_started", (data) => callback(data));
    }

    public stopListenForSequenceAnalysisResponse() {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.off("sequence_analysis_response");
    }

    public stopListenForSequenceAnalysisEnqueued() {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.off("sequence_analysis_enqueued");
    }

    public stopListenForSequenceAnalysisFailed() {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.off("sequence_analysis_failed");
    }

    public stopListenForSequenceAnalysisStarted() {
        if (!this.client) {
            throw new GentrainException("");
        }
        this.client.off("sequence_analysis_started");
    }
}
