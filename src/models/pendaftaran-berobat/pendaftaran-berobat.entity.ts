import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/mysql";
import { PendaftaranBerobatRepository } from "./pendaftaran-berobat.repository";
import { Pasien } from "../pasien/pasien.entity";

@Entity({ repository: () => PendaftaranBerobatRepository })
export class PendaftaranBerobat {
    @PrimaryKey({ autoincrement: true })
        idPendaftaran!: number;

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

    @Property({ nullable: false })
        tanggalPengajuan!: string;

    @Property({ nullable: false })
        poli!: string;

    @Property({ nullable: false })
        keluhan!: string;

    @Property({ nullable: false })
        namaDokter!: string;

    @Property({ nullable: false })
        jam!: string;

    @Property({ nullable: false })
        jenisPembayaran!: string;

    @Property({ nullable: false })
        totalPembayaran!: string;

    @ManyToOne(() => Pasien, { nullable: false }) // TODO to ID FK
        fk!: number;

    constructor(
        // idPendaftaran: number,
        nik: string,
        nama: string,
        jenisKelamin: string,
        alamat: string,
        noTel: string,
        tanggalLahir: string,
        tanggalPengajuan: string,
        poli: string,
        keluhan: string,
        namaDokter: string,
        jam: string,
        jenisPembayaran: string,
        totalPembayaran: string,
        fk: number,
    ) {
        // this.idPendaftaran = idPendaftaran;
        this.nik = nik;
        this.nama = nama;
        this.jenisKelamin = jenisKelamin;
        this.alamat = alamat;
        this.noTel = noTel;
        this.tanggalLahir = tanggalLahir;
        this.tanggalPengajuan = tanggalPengajuan
        this.poli = poli,
        this.keluhan = keluhan,
        this.namaDokter = namaDokter,
        this.jam = jam,
        this.jenisPembayaran = jenisPembayaran,
        this.totalPembayaran = totalPembayaran,
        this.fk = fk;
    }
}
