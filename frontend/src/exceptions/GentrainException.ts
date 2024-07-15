export class GentrainException extends Error {
    data;

    constructor(message: string, data?: any) {
        super(message);
        this.data = data;
    }
}
