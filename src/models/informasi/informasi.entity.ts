import { Entity, PrimaryKey, Property } from "@mikro-orm/mysql";
import { InformasiRepository } from "./informasi.repository";

@Entity({ repository: () => InformasiRepository })
export class Informasi {
    @PrimaryKey({ autoincrement: true })
        idInformasi!: number;

    @Property({ nullable: false })
        foto!: string;

    @Property({ nullable: false })
        judul!: string;

    @Property({ type: "text", nullable: false })
        isi!: string;

    @Property({ onCreate: () => new Date() })
        created!: Date;

    constructor(foto: string, judul: string, isi: string) {
        this.foto = foto;
        this.judul = judul;
        this.isi = isi;
    }
}
