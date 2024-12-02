import { EntityRepository } from "@mikro-orm/mysql";
import { User } from "./user.entity";
import { EntityExistsError, EntityNotFound } from "../../utils/erros";
import z from "zod";

export class UserRepository extends EntityRepository<User> {
    static validFilter = z.enum(["id"]);
    async fetch(filter?: string, value?: string): Promise<User[]> {
        if (filter && value && UserRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async save(username: string, email: string, password: string): Promise<void> {
        if (await this.exists(username, email)) {
            throw new EntityExistsError(username, email);
        }

        const newUser = new User(username, email, password);
        this.create(newUser);
        await this.em.flush();
    }

    async delete(id: number): Promise<void> {
        const user = await this.findOne(id);

        if (!user) {
            throw new EntityNotFound(id);
        }
        await this.em.removeAndFlush(user);
    }

    async flush(): Promise<void> {
        this.em.flush();
    }

    private async exists(username: string, email: string): Promise<boolean> {
        const count = await this.qb().where({ username }).orWhere({ email }).getCount();
        return count > 0;
    }
}
