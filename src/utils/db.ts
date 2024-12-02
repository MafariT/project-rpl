import { MikroORM, Options, EntityManager } from "@mikro-orm/mysql";
import config from "./mikro-orm.config";
import { User } from "../models/user/user.entity";
import { Pasien } from "../models/pasien/pasien.entity";
import { PendaftaranBerobat } from "../models/pendaftaran-berobat/pendaftaran-berobat.entity";
import { Informasi } from "../models/informasi/informasi.entity";
import { Dokter } from "../models/dokter/dokter.entity";
import { Ulasan } from "../models/ulasan/ulasan.entity";
import { UserRepository } from "../models/user/user.repository";
import { PasienRepository } from "../models/pasien/pasien.repository";
import { PendaftaranBerobatRepository } from "../models/pendaftaran-berobat/pendaftaran-berobat.repository";
import { InformasiRepository } from "../models/informasi/informasi.repository";
import { DokterRepository } from "../models/dokter/dokter.repository";
import { UlasanRepository } from "../models/ulasan/ulasan.repository";
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
    user: UserRepository;
    pendaftaranBerobat: PendaftaranBerobatRepository;
    informasi: InformasiRepository;
    dokter: DokterRepository;
    ulasan: UlasanRepository;
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
        user: orm.em.fork().getRepository(User),
        pendaftaranBerobat: orm.em.fork().getRepository(PendaftaranBerobat),
        informasi: orm.em.fork().getRepository(Informasi),
        dokter: orm.em.fork().getRepository(Dokter),
        ulasan: orm.em.fork().getRepository(Ulasan),
        // article: orm.em.getRepository(Article),
        // comment: orm.em.getRepository(Comment)
        // tag: orm.em.getRepository(Tag),
    });
}
