import { Pathogen } from "../models/pathogens";

export class GentrainApi {
    protected url: string = `${import.meta.env.VITE_API_HOST}`;
    protected username: string = `${import.meta.env.VITE_API_BASIC_USERNAME}`;
    protected password: string = `${import.meta.env.VITE_API_BASIC_PASSWORD}`;

    private defaultHeaderParameters = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${this.username}:${this.password}`),
    };

    // Pathogens

    public async getPathogens() {
        const pathogens: Pathogen[] = await this.getRequest(`${import.meta.env.VITE_API_HOST}/pathogens`);
        return pathogens ?? [];
    }

    // Sequence Analyses

    public async getSequenceAnalysisResultsForSessionAndPathogen(
        sessionId: string,
        pathogenId: number
    ): Promise<{ fasta_id: string; result: object; sequence_identifier: string; sequence_length: number }[]> {
        const sequenceAnalysisResults = await this.getRequest(
            `${import.meta.env.VITE_API_HOST}/sequence_analyses/sessions/${sessionId}/pathogens/${pathogenId}`
        );
        return sequenceAnalysisResults ?? [];
    }

    public async deleteSequenceAnalysisResultForPathogenAndSession(
        sessionId: string,
        pathogenId: number,
        sequenceIdentifier: string
    ) {
        const response = await this.deleteRequest(
            `${
                import.meta.env.VITE_API_HOST
            }/sequence_analyses/sessions/${sessionId}/pathogens/${pathogenId}/sequences/${sequenceIdentifier}`
        );
        return response;
    }

    // Infrastructure

    private async getRequest(url: string, headerParameters?: { [key: string]: string }) {
        try {
            const response = await fetch(url, { headers: { ...this.defaultHeaderParameters, ...headerParameters } });
            if (response.ok) {
                return response.json();
            }
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
            if (response.ok) {
                return response.json();
            }
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return null;
        }
    }
}
