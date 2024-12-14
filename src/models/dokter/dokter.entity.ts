import { Entity, PrimaryKey, Property } from "@mikro-orm/mysql";
import { DokterRepository } from "./dokter.repository";

@Entity({ repository: () => DokterRepository })
export class Dokter {
    @PrimaryKey({ autoincrement: true })
        idDokter!: number;

    @Property({ nullable: false })
        nama!: string;

    @Property({ nullable: false })
        poli!: string;

    @Property({ nullable: false })
        jamMulai!: string;

    @Property({ nullable: false })
        jamSelesai!: string;

    @Property({ onCreate: () => new Date() })
        created!: Date;

    constructor(nama: string, poli: string, jamMulai: string, jamSelesai: string) {
        this.nama = nama;
        this.poli = poli;
        this.jamMulai = jamMulai;
        this.jamSelesai = jamSelesai;
    }
}
