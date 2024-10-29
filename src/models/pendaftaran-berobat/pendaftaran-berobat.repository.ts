import { EntityRepository } from "@mikro-orm/mysql";
import { PendaftaranBerobat } from "./pendaftaran-berobat.entity";
import { EntityExistsError } from "../../utils/erros";
import z from "zod";

export class PendaftaranBerobatRepository extends EntityRepository<PendaftaranBerobat> {
    static validFilter = z.enum(["idPendaftaran"]);
    async fetch(filter?: string, value?: string): Promise<PendaftaranBerobat[]> {
        if (filter && value && PendaftaranBerobatRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async save(
        nama: string,
        keluhan: string,
        poliklinik: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        jenisKelamin: string,
        nik: string,
    ): Promise<void> {
        if (await this.exists(nik)) {
            throw new EntityExistsError(nik);
        }

        const newPendaftaranBerobat = new PendaftaranBerobat(
            nama,
            keluhan,
            poliklinik,
            alamat,
            noTel,
            tanggalLahir,
            jenisKelamin,
            nik,
        );
        this.create(newPendaftaranBerobat);
        await this.em.flush();
    }

    private async exists(nik: string): Promise<boolean> {
        const count = await this.qb().where({ nik }).getCount();
        return count > 0;
    }
}
