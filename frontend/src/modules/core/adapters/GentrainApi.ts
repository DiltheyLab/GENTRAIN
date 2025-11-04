import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { Pathogen } from "@/modules/core/models/pathogens";
import { AlignedSequences, PersistedSequenceAnalysis } from "@/modules/core/types/api";
import { deleteSequenceAnalysisById, SequenceAnalysisSchema } from "../models/sequence_analyses";

export class GentrainApi {
    private url: string = `${import.meta.env.VITE_API_HOST}`;

    private defaultHeaderParameters = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    // Pathogens
    public async getPathogensFromServer() {
        const pathogens = await this.getRequest<Pathogen[]>(`${this.url}/pathogens`);
        return pathogens;
    }

    // Sequence Analyses
    public async getPersistedSequenceAnalysisResult(sequenceAnalysis: SequenceAnalysisSchema) {
        const sequenceAnalysesResult = await this.getRequest<PersistedSequenceAnalysis>(
            `${this.url}/sequence_analyses/${sequenceAnalysis.fasta_hash}/result`
        );
        if (sequenceAnalysesResult === undefined) {
            deleteSequenceAnalysisById(sequenceAnalysis.id);
            return null;
        }
        return sequenceAnalysesResult;
    }

    public async deleteSequenceAnalysisResultForHash(fastaHash: string) {
        const response = await this.deleteRequest(`${this.url}/sequence_analyses/${fastaHash}/result`);
        return response;
    }

    public async alignSequences(sequence1: string, sequence2: string) {
        const response = await this.postRequest<AlignedSequences>(`${this.url}/sequences/align`, {
            sequence_1: sequence1,
            sequence_2: sequence2,
        });
        return response;
    }

    // Infrastructure
    private async getRequest<T>(url: string, headerParameters?: { [key: string]: string }) {
        try {
            const response = await fetch(url, { headers: { ...this.defaultHeaderParameters, ...headerParameters } });
            if (!response.ok) {
                this.handleException(response);
            }
            const data = await response.json();
            return data as T;
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return;
        }
    }

    private async postRequest<T>(
        url: string,
        bodyParameters: { [key: string]: any },
        headerParameters?: { [key: string]: string }
    ) {
        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(bodyParameters),
                headers: { ...this.defaultHeaderParameters, ...headerParameters },
            });

            if (!response.ok) {
                this.handleException(response);
            }

            const data = await response.json();
            return data as T;
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return;
        }
    }

    private async deleteRequest<T>(url: string, headerParameters?: { [key: string]: string }) {
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: { ...this.defaultHeaderParameters, ...headerParameters },
            });
            if (!response.ok) {
                this.handleException(response);
            }
            const data = await response.json();
            return data as T;
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return;
        }
    }

    private handleException(response: Response) {
        switch (response.status) {
            case 400:
                throw new GentrainException("BadRequest: The request was invalid.", { status: response.status });
            case 401:
                throw new GentrainException("Unauthorized: Authentication failed.", { status: response.status });
            case 403:
                throw new GentrainException("Forbidden: Access denied.", { status: response.status });
            case 404:
                throw new GentrainException("NotFound: Resource not found.", { status: response.status });
            case 422:
                throw new GentrainException("UnprocessableContent: The entity could not be processed.", {
                    status: response.status,
                });
            case 500:
                throw new GentrainException("ServerError: Internal server error.", { status: response.status });
            default:
                throw new GentrainException(`ApiError: ${response.status} ${response.statusText}`, {
                    status: response.status,
                });
        }
    }
}

const gentrainApiInstance = new GentrainApi();
export default gentrainApiInstance;
