import { Pathogen } from "../models/pathogens";

export class GentrainApi {
    protected url: string = `${import.meta.env.VITE_API_HOST}`;
    protected username: string = `${import.meta.env.VITE_API_BASIC_USERNAME}`;
    protected password: string = `${import.meta.env.VITE_API_BASIC_PASSWORD}`;

    constructor() {}

    private defaultHeaderParameters = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${this.username}:${this.password}`),
    };

    public async getAllPathogens() {
        const pathogens: Pathogen[] = await this.getRequest(`${import.meta.env.VITE_API_HOST}/pathogens`);
        return pathogens ?? [];
    }

    private async getRequest(url: string, headerParameters?: { [key: string]: string }) {
        try {
            const response = await fetch(url, { headers: { ...this.defaultHeaderParameters, ...headerParameters } });
            return response.json();
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return null;
        }
    }

    /*
    private async postRequest(
        url: string,
        headerParameters?: { [key: string]: string },
        bodyParameters?: { [key: string]: any }
    ) {
        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(bodyParameters),
                headers: { ...this.defaultHeaderParameters, ...headerParameters },
            });
            return response.json();
        } catch (error) {
            console.error("Error fetching from Gentrain API.", error);
            return null;
        }
    }
    */
}
