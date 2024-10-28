import { EntityRepository } from "@mikro-orm/mysql";
import { Dokter } from "./dokter.entity";
import { EntityExistsError } from "../../utils/erros";
import z from "zod";

export class DokterRepository extends EntityRepository<Dokter> {
    static validFilter = z.enum(["idDokter"]);
    async fetch(filter?: string, value?: string): Promise<Dokter[]> {
        if (filter && value && DokterRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async save(
        idDokter: string,
        nama: string,
        poliKlinik: string,
        // alamat: string,
        // noTel: number,
        // tanggalLahir: string,
        // jenisKelamin: string,
    ): Promise<void> {
        if (await this.exists(idDokter)) {
            throw new EntityExistsError(idDokter);
        }

        const newDokter = new Dokter(idDokter, nama, poliKlinik);
        this.create(newDokter);
        await this.em.flush();
    }

    private async exists(idDokter: string): Promise<boolean> {
        const count = await this.qb().where({ idDokter }).getCount();
        return count > 0;
    }
}
