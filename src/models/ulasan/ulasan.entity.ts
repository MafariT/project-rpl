import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { UlasanRepository } from "./ulasan.repository";
import { Pasien } from "../pasien/pasien.entity";

@Entity({ repository: () => UlasanRepository })
export class Ulasan {
    @PrimaryKey({ autoincrement: true })
        idUlasan!: number;

    @Property({ nullable: false })
        rating!: number;

    @Property({ nullable: false })
        isi!: string;

    @Property({ onCreate: () => new Date(), hidden: false })
        created!: Date;

    @ManyToOne(() => Pasien, { nullable: false })
        fk!: number;
    constructor(rating: number, isi: string, fk: number) {
        this.rating = rating;
        this.isi = isi;
        this.fk = fk;
    }
}
