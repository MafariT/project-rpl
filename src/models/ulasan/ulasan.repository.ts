import { EntityRepository } from "@mikro-orm/mysql";
import { Ulasan } from "./ulasan.entity";
import z from "zod";

export class UlasanRepository extends EntityRepository<Ulasan> {
    static validFilter = z.enum(["idUlasan"]);
    async fetch(filter?: string, value?: string): Promise<Ulasan[]> {
        if (filter && value && UlasanRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async update(idUlasan: number, rating: number, isi: string, balasan: string, fk: number): Promise<void> {
        const existingUlasan = await this.findOne({ idUlasan });

        if (existingUlasan) {
            existingUlasan.rating = rating;
            existingUlasan.isi = isi;
            existingUlasan.balasan = balasan;
            existingUlasan.fk = fk;

            this.em.persist(existingUlasan);
        }
        await this.em.flush();
    }

    async save(rating: number, isi: string, balasan: string, fk: number): Promise<void> {
        const newUlasan = new Ulasan(rating, isi, balasan, fk);
        this.create(newUlasan);
        await this.em.flush();
    }
}
