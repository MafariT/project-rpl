export class ExistsError extends Error {
    constructor(id: string) {
        super(`${id} already exists`);
        this.name = "UserExistsError";
    }
}
