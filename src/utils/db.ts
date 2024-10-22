import { MikroORM, Options, EntityManager } from "@mikro-orm/mysql";
import config from "./mikro-orm.config";
import { PasienRepository } from "../models/pasien.repository";
import { Pasien } from "../models/pasien.entity";
// import { User } from './modules/user/user.entity.js';
// import { Comment } from './modules/article/comment.entity.js';
// import { Article } from './modules/article/article.entity.js';
// import { Tag } from './modules/article/tag.entity.js';
// import { UserRepository } from './modules/user/user.repository.js';
// import { ArticleRepository } from './modules/article/article.repository.js';

export interface Services {
    orm: MikroORM;
    em: EntityManager;
    pasien: PasienRepository;
    // comment: EntityRepository<Comment>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
    if (cache) {
        return cache;
    }

    // allow overriding config options for testing
    const orm = await MikroORM.init({
        ...config,
        ...options,
    });

    // save to cache before returning
    return (cache = {
        orm,
        em: orm.em,
        pasien: orm.em.fork().getRepository(Pasien),
        // article: orm.em.getRepository(Article),
        // comment: orm.em.getRepository(Comment)
        // tag: orm.em.getRepository(Tag),
    });
}
