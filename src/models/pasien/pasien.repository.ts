import { EntityRepository } from "@mikro-orm/mysql";
import { Pasien } from "./pasien.entity";
import { EntityExistsError } from "../../utils/erros";
import z from "zod";

export class PasienRepository extends EntityRepository<Pasien> {
    static validFilter = z.enum(["nik"]);
    async fetch(filter?: string, value?: string): Promise<Pasien[]> {
        if (filter && value && PasienRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async save(
        nik: string,
        nama: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        jenisKelamin: string,
        fk: number,
    ): Promise<void> {
        if (await this.exists(nik)) {
            throw new EntityExistsError(nik);
        }

        const newPasien = new Pasien(nik, nama, alamat, noTel, tanggalLahir, jenisKelamin, fk);
        this.create(newPasien);
        await this.em.flush();
    }

    private async exists(nik: string): Promise<boolean> {
        const count = await this.qb().where({ nik }).getCount();
        return count > 0;
    }
}
