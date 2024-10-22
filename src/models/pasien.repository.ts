import { EntityRepository } from "@mikro-orm/mysql";
import { Pasien } from "./pasien.entity";

export class PasienExistsError extends Error {
    constructor(username: string) {
        super(`${username} already exists`);
        this.name = "UserExistsError";
    }
}

export class PasienRepository extends EntityRepository<Pasien> {
    async fetchPasien(filter?: string, value?: string): Promise<Pasien[]> {
        if (filter && value && Pasien.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: { $like: `%${value}%` } });
        } else {
            return this.findAll({ limit: 10000 });
        }
    }

    async save(
        nik: string,
        fullName: string,
        alamat: string,
        noTel: number,
        tanggalLahir: Date,
        jenisKelamin: string,
        username: string,
        password: string,
        email: string
    ): Promise<void> {
        if (await this.exists(nik)) {
            throw new PasienExistsError(nik);
        }

        const newPasien = new Pasien(
            nik, fullName, alamat, noTel,
            tanggalLahir, jenisKelamin, username, password, email);
        this.create(newPasien);
        await this.em.flush();
    }

    async exists(nik: string): Promise<boolean> {
        const count = await this.qb().where({ nik }).getCount();
        return count > 0;
    }
}
