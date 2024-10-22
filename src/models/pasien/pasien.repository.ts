import { EntityRepository } from "@mikro-orm/mysql";
import { Pasien } from "./pasien.entity";

export class PasienExistsError extends Error {
    constructor(nik: string) {
        super(`${nik} already exists`);
        this.name = "UserExistsError";
    }
}

export class PasienRepository extends EntityRepository<Pasien> {
    async fetch(filter?: string, value?: string): Promise<Pasien[]> {
        if (filter && value && Pasien.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: { $like: `%${value}%` } });
        } else {
            return this.findAll({ limit: 10000 });
        }
    }

    async save(
        nik: string,
        nama: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        jenisKelamin: string,
    ): Promise<void> {
        if (await this.exists(nik)) {
            throw new PasienExistsError(nik);
        }

        const newPasien = new Pasien(nik, nama, alamat, noTel, tanggalLahir, jenisKelamin);
        this.create(newPasien);
        await this.em.flush();
    }

    async exists(nik: string): Promise<boolean> {
        const count = await this.qb().where({ nik }).getCount();
        return count > 0;
    }
}
