import {
    Entity,
    PrimaryKey,
    Property,
} from "@mikro-orm/core";
import { PasienRepository } from "./pasien.repository";

@Entity({ repository: () => PasienRepository })
export class Pasien {
    @PrimaryKey()
        nik!: string;

    @Property({ nullable: false })
        nama!: string;

    @Property({ nullable: false })
        alamat!: string;

    @Property({ nullable: false })
        noTel!: number;

    @Property({ nullable: false })
        tanggalLahir!: string;

    @Property({ nullable: false })
        jenisKelamin!: string;

    constructor(
        nik: string,
        nama: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        jenisKelamin: string,
    ) {
        this.nik = nik;
        this.nama = nama;
        this.alamat = alamat;
        this.noTel = noTel;
        this.tanggalLahir = tanggalLahir;
        this.jenisKelamin = jenisKelamin;
    }
}
