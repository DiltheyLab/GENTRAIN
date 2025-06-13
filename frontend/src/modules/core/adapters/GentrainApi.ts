import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { Pathogen } from "@/modules/core/models/pathogens";
import { AlignedSequences, PersistedSequenceAnalysis } from "@/modules/core/types/api";

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
    public async getPersistedSequenceAnalysisResult(fastaHash: string) {
        const sequenceAnalysesResult = await this.getRequest<PersistedSequenceAnalysis>(
            `${this.url}/sequence_analyses/${fastaHash}`
        );
        return sequenceAnalysesResult;
    }

    public async deleteSequenceAnalysisResultForPathogenAndSession(fastaHash: string) {
        const response = await this.deleteRequest(`${this.url}/sequence_analyses/${fastaHash}`);
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
                throw new GentrainException("BadRequest: The request was invalid.");
            case 401:
                throw new GentrainException("Unauthorized: Authentication failed.");
            case 403:
                throw new GentrainException("Forbidden: Access denied.");
            case 404:
                throw new GentrainException("NotFound: Resource not found.");
            case 500:
                throw new GentrainException("ServerError: Internal server error.");
            default:
                throw new GentrainException(`ApiError: ${response.status} ${response.statusText}`);
        }
    }
}

const gentrainApiInstance = new GentrainApi();
export default gentrainApiInstance;
