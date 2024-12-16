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

    @Property({ nullable: true })
        balasan!: string;

    @Property({ nullable: true, onUpdate: () => new Date() })
        balasanCreated!: string;

    @Property({ onCreate: () => new Date() })
        created!: Date;

    @ManyToOne(() => Pasien, { nullable: false })
        fk!: number;

    constructor(rating: number, isi: string, balasan: string, fk: number) {
        this.rating = rating;
        this.isi = isi;
        this.balasan = balasan;
        this.fk = fk;
    }
}
