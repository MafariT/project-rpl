export class EntityExistsError extends Error {
    constructor(...args: any[]) {
        if (args.length === 1) {
            super(`${args[0]} already exists`);
        }
        if (args.length === 2) {
            super(`${args[0]} or ${args[1]} already exist`);
            this.name = "EntityExistsError";
        }
    }
}

export class EntityNotFound extends Error {
    constructor(id: number) {
        super(`${id} Not Found`);
        this.name = "EntityNotFound";
    }
}
