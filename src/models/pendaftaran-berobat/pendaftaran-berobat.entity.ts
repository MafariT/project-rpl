import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { PendaftaranBerobatRepository } from "./pendaftaran-berobat.repository";
import { Pasien } from "../pasien/pasien.entity";

@Entity({ repository: () => PendaftaranBerobatRepository })
export class PendaftaranBerobat {
    @PrimaryKey({ autoincrement: true })
        idPendaftaran!: number;

    @Property({ nullable: false })
        nama!: string;

    @Property({ onCreate: () => new Date() })
        tanggal!: Date;

    @Property({ nullable: false })
        keluhan!: string;

    @Property({ nullable: false })
        poliklinik!: string;

    @Property({ nullable: false })
        alamat!: string;

    @Property({ nullable: false })
        noTel!: number;

    @Property({ nullable: false })
        tanggalLahir!: string;

    @Property({ nullable: false })
        jenisKelamin!: string;

    @ManyToOne(() => Pasien, { nullable: false }) // TODO to ID FK
        fk!: string;

    constructor(
        // idPendaftaran: number,
        nama: string,
        keluhan: string,
        poliklinik: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        jenisKelamin: string,
        fk: string,
    ) {
        // this.idPendaftaran = idPendaftaran;
        this.nama = nama;
        this.fk = fk;
        this.keluhan = keluhan;
        this.poliklinik = poliklinik;
        this.alamat = alamat;
        this.noTel = noTel;
        this.tanggalLahir = tanggalLahir;
        this.jenisKelamin = jenisKelamin;
    }
}
