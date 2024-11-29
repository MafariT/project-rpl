import { Entity, PrimaryKey, Property } from "@mikro-orm/mysql";
import { DokterRepository } from "./dokter.repository";

@Entity({ repository: () => DokterRepository })
export class Dokter {
    @PrimaryKey({ autoincrement: true })
        idDokter!: number;

    @Property({ nullable: false })
        nama!: string;

    @Property({ nullable: false })
        poliKlinik!: string;

    @Property({ nullable: false })
        jamMulai!: string;

    @Property({ nullable: false })
        jamSelesai!: string;

    constructor(nama: string, poliKlinik: string, jamMulai: string, jamSelesai: string) {
        this.nama = nama;
        this.poliKlinik = poliKlinik;
        this.jamMulai = jamMulai;
        this.jamSelesai = jamSelesai;
    }
}
