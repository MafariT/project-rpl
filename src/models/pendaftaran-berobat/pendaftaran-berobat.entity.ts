import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { PendaftaranBerobatRepository } from "./pendaftaran-berobat.repository";
import { Pasien } from "../pasien/pasien.entity";

@Entity({ repository: () => PendaftaranBerobatRepository })
export class PendaftaranBerobat {
    @PrimaryKey({ autoincrement: true })
        idPendaftaran!: number;

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

    @ManyToOne(() => Pasien, { nullable: false })
        nik!: string;

    constructor(
        // idPendaftaran: number,
        keluhan: string,
        poliklinik: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        jenisKelamin: string,
        nik: string,
    ) {
        // this.idPendaftaran = idPendaftaran;
        this.nik = nik;
        this.keluhan = keluhan;
        this.poliklinik = poliklinik;
        this.alamat = alamat;
        this.noTel = noTel;
        this.tanggalLahir = tanggalLahir;
        this.jenisKelamin = jenisKelamin;
    }
}
