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

    async update(idInformasi: number, foto: string | null, judul: string, isi: string): Promise<void> {
        const existingInformasi = await this.findOne({ idInformasi });

        if (existingInformasi) {
            existingInformasi.foto = foto;
            existingInformasi.judul = judul;
            existingInformasi.isi = isi;

            this.em.persist(existingInformasi);
        }
        await this.em.flush();
    }

    async save(foto: string | null, judul: string, isi: string): Promise<void> {
        const newInformasi = new Informasi(foto, judul, isi);
        this.create(newInformasi);
        await this.em.flush();
    }

    async remove(informasi: Informasi) {
        this.em.removeAndFlush(informasi);
    }
}
