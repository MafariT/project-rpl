import { Entity, PrimaryKey, Property } from "@mikro-orm/mysql";
import { DokterRepository } from "./dokter.repository";

@Entity({ repository: () => DokterRepository })
export class Dokter {
    @PrimaryKey()
        idDokter!: string;

    @Property({ nullable: false })
        nama!: string;

    @Property({ nullable: false })
        poliKlinik!: string;

    // @Property({ nullable: false })
    //     alamat!: string;

    // @Property({ nullable: false })
    //     noTel!: number;

    // @Property({ nullable: false })
    //     tanggalLahir!: string;

    // @Property({ nullable: false })
    //     jenisKelamin!: string;

    constructor(
        idDokter: string,
        nama: string,
        poliKlinik: string,
        // alamat: string,
        // noTel: number,
        // tanggalLahir: string,
        // jenisKelamin: string,
    ) {
        this.idDokter = idDokter;
        this.nama = nama;
        this.poliKlinik = poliKlinik;
        // this.alamat = alamat;
        // this.noTel = noTel;
        // this.tanggalLahir = tanggalLahir;
        // this.jenisKelamin = jenisKelamin;
    }
}
