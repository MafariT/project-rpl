import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { AdminRepository } from "./admin.repository";
import { User } from "../user/user.entity";

@Entity({ repository: () => AdminRepository })
export class Admin {
    @PrimaryKey({ autoincrement: true })
        idAdmin!: number;

    @Property({ nullable: false, length: 16 })
        nip!: string;

    @Property({ nullable: false, length: 128 })
        nama!: string;

    @Property({ nullable: false, length: 16 })
        jenisKelamin!: string;

    @Property({ nullable: false, length: 128 })
        alamat!: string;

    @Property({ nullable: false, length: 16 })
        noTel!: string;

    @Property({ nullable: false, length: 12 })
        tanggalLahir!: string;

    @Property()
        fotoProfil!: string | null;

    @Property({ onCreate: () => new Date() })
        created!: Date;

    @OneToOne(() => User, { nullable: false })
        fk!: number;

    constructor(
        nip: string,
        nama: string,
        jenisKelamin: string,
        alamat: string,
        noTel: string,
        tanggalLahir: string,
        fotoProfil: string | null,
        fk: number,
    ) {
        this.nip = nip;
        this.nama = nama;
        this.jenisKelamin = jenisKelamin;
        this.alamat = alamat;
        this.noTel = noTel;
        this.tanggalLahir = tanggalLahir;
        this.fotoProfil = fotoProfil;
        this.fk = fk;
    }
}
