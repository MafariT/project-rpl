import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { PasienRepository } from "./pasien.repository";
import { User } from "../user/user.entity";

@Entity({ repository: () => PasienRepository })
export class Pasien {
    @PrimaryKey({ autoincrement: true })
        idPasien!: number;

    @Property({ nullable: false })
        nik!: string;

    @Property({ nullable: false })
        nama!: string;

    @Property({ nullable: false })
        jenisKelamin!: string;

    @Property({ nullable: false })
        alamat!: string;

    @Property({ nullable: false })
        noTel!: string;

    @Property({ nullable: false })
        tanggalLahir!: string;

    @Property()
        fotoProfil!: string | null;

    @OneToOne(() => User, { nullable: false })
        fk!: number;
    constructor(
        nik: string,
        nama: string,
        jenisKelamin: string,
        alamat: string,
        noTel: string,
        tanggalLahir: string,
        fotoProfil: string | null,
        fk: number,
    ) {
        this.nik = nik;
        this.nama = nama;
        this.jenisKelamin = jenisKelamin;
        this.alamat = alamat;
        this.noTel = noTel;
        this.tanggalLahir = tanggalLahir;
        this.fotoProfil = fotoProfil;
        this.fk = fk;
    }
}
