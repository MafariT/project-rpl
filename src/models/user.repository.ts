import { EntityRepository } from "@mikro-orm/mysql";
import { User } from "./user.entity";

export class UserExistsError extends Error {
    constructor(username: string) {
        super(`${username} already exists`);
        this.name = "UserExistsError";
    }
}

export class UserRepository extends EntityRepository<User> {
    async fetchUsers(filter?: string, value?: string): Promise<User[]> {
        if (filter && value && User.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: { $like: `%${value}%` } });
        } else {
            return this.findAll();
        }
    }

    async saveUser(username: string, displayName: string): Promise<void> {
        if (await this.exists(username)) {
            throw new UserExistsError(username);
        }

        const newUser = new User(username, displayName);
        await this.getEntityManager().persistAndFlush(newUser);
    }

    async exists(username: string): Promise<boolean> {
        const count = await this.qb().where({ username }).getCount();
        return count > 0;
    }
}
