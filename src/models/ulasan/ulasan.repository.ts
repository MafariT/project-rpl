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

    async save(rating: number, isi: string, fk: number): Promise<void> {
        const newUlasan = new Ulasan(rating, isi, fk);
        this.create(newUlasan);
        await this.em.flush();
    }
}
