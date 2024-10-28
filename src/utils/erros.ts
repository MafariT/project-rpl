export class EntityExistsError extends Error {
    constructor(id: any) {
        super(`${id} already exists`);
        this.name = "UserEntityExistsError";
    }
}

export class EntityNotFound extends Error {
    constructor(id: number) {
        super(`${id} Not Found`);
        this.name = "EntityNotFound";
    }
}
