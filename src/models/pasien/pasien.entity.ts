import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
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
        alamat!: string;

    @Property({ nullable: false })
        noTel!: number;

    @Property({ nullable: false })
        tanggalLahir!: string;

    @Property()
        fotoProfil!: string | null;

    // @Property({ nullable: false })
    //     jenisKelamin!: string;

    @ManyToOne(() => User, { nullable: false })
        fk!: number;
    constructor(
        nik: string,
        nama: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        fotoProfil: string | null,
        // jenisKelamin: string,
        fk: number,
    ) {
        this.nik = nik;
        this.nama = nama;
        this.alamat = alamat;
        this.noTel = noTel;
        this.tanggalLahir = tanggalLahir;
        this.fotoProfil = fotoProfil;
        // this.jenisKelamin = jenisKelamin;
        this.fk = fk;
    }
}