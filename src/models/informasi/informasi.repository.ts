import { EntityRepository } from "@mikro-orm/mysql";
import { Informasi } from "./informasi.entity";
import z from "zod";

export class InformasiRepository extends EntityRepository<Informasi> {
    static validFilter = z.enum(["idInformasi"]);
    async fetch(filter?: string, value?: string): Promise<Informasi[]> {
        if (filter && value && InformasiRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async saveOrUpdate(
        foto: string,
        judul: string,
        isi: string
    ): Promise<void> {
        const existingInformasi = await this.findOne({ judul });

        if (existingInformasi) {
            existingInformasi.foto = foto;
            existingInformasi.judul = judul;
            existingInformasi.isi = isi;

            this.em.persist(existingInformasi);
        } else {
            const newInformasi = new Informasi(foto, judul, isi);
            this.create(newInformasi);
        }

        await this.em.flush();
    }
}
