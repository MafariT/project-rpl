import { EntityRepository } from "@mikro-orm/mysql";
import { User } from "./user.entity";

export class UserExistsError extends Error {
    constructor(username: string) {
        super(`${username} already exists`);
        this.name = "UserExistsError";
    }
}

export class UserRepository extends EntityRepository<User> {
    async fetch(filter?: string, value?: string): Promise<User[]> {
        if (filter && value && User.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: { $like: `%${value}%` } });
        } else {
            return this.findAll({ limit: 10000 });
        }
    }

    async save(username: string, email: string, password: string): Promise<void> {
        if (await this.exists(username)) {
            throw new UserExistsError(username);
        }

        const newUser = new User(username, email, password);
        this.create(newUser);
        await this.em.flush();
    }

    async exists(username: string): Promise<boolean> {
        const count = await this.qb().where({ username }).getCount();
        return count > 0;
    }
}
