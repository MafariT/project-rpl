import { EntityRepository } from "@mikro-orm/mysql";
import { Dokter } from "./dokter.entity";
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

    async save(nama: string, poliKlinik: string, jamMulai: string, jamSelesai: string): Promise<void> {
        const newDokter = new Dokter(nama, poliKlinik, jamMulai, jamSelesai);
        this.create(newDokter);
        await this.em.flush();
    }
}
