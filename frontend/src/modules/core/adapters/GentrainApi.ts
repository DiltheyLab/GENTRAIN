import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { Pathogen } from "@/modules/core/models/pathogens";
import { PersistedSequenceAnalysisResult } from "@/modules/core/types/api";

export class GentrainApi {
    private url: string = `${import.meta.env.VITE_API_HOST}`;

    private defaultHeaderParameters = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    // Pathogens
    public async getPathogens() {
        const pathogens: Pathogen[] = await this.getRequest(`${import.meta.env.VITE_API_HOST}/pathogens`);
        return pathogens ?? [];
    }

    // Sequence Analyses
    public async getPersistedSequenceAnalysisResults(sessionId: string, pathogenId: number) {
        const sequenceAnalysisResults: PersistedSequenceAnalysisResult[] = await this.getRequest(
            `${this.url}/sequence_analyses/sessions/${sessionId}/pathogens/${pathogenId}`
        );
        return sequenceAnalysisResults ?? [];
    }

    public async deleteSequenceAnalysisResultForPathogenAndSession(
        sessionId: string,
        pathogenId: number,
        sequenceIdentifier: string
    ) {
        const response = await this.deleteRequest(
            `${this.url}/sequence_analyses/sessions/${sessionId}/pathogens/${pathogenId}/sequences/${sequenceIdentifier}`
        );
        return response;
    }

    public async alignSequences(sequence1: string, sequence2: string) {
        const response = await this.postRequest(`${this.url}/sequences/align`, {
            sequence_1: sequence1,
            sequence_2: sequence2,
        });
        return response;
    }

    // Infrastructure
    private async getRequest(url: string, headerParameters?: { [key: string]: string }) {
        try {
            const response = await fetch(url, { headers: { ...this.defaultHeaderParameters, ...headerParameters } });
            if (!response.ok) {
                throw new GentrainException("ApiError");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return null;
        }
    }

    private async postRequest(
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
                throw new GentrainException("ApiError");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return null;
        }
    }

    private async deleteRequest(url: string, headerParameters?: { [key: string]: string }) {
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: { ...this.defaultHeaderParameters, ...headerParameters },
            });
            if (!response.ok) {
                throw new GentrainException("ApiError");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return null;
        }
    }
}

const gentrainApiInstance = new GentrainApi();
export default gentrainApiInstance;
