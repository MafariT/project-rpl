import { EntityRepository } from "@mikro-orm/mysql";
import { PendaftaranBerobat } from "./pendaftaran-berobat.entity";
import { EntityExistsError } from "../../utils/erros";
import z from "zod";

export class PendaftaranBerobatRepository extends EntityRepository<PendaftaranBerobat> {
    static validFilter = z.enum(["idPendaftaran"]);
    async fetch(filter?: string, value?: string): Promise<PendaftaranBerobat[]> {
        if (filter && value && PendaftaranBerobatRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async remove(pendaftaranBerobat: PendaftaranBerobat) {
        this.em.removeAndFlush(pendaftaranBerobat);
    }

    async update(
        idPendaftaran: number,
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
        noTagihan: string,
        // totalPembayaran: string,
        fk: number,
    ): Promise<void> {
        const existingPendaftaranBerobat = await this.findOne({ idPendaftaran });

        if (existingPendaftaranBerobat) {
            existingPendaftaranBerobat.nik = nik;
            existingPendaftaranBerobat.nama = nama;
            existingPendaftaranBerobat.jenisKelamin = jenisKelamin;
            existingPendaftaranBerobat.alamat = alamat;
            existingPendaftaranBerobat.noTel = noTel;
            existingPendaftaranBerobat.tanggalLahir = tanggalLahir;
            existingPendaftaranBerobat.tanggalPengajuan = tanggalPengajuan;
            existingPendaftaranBerobat.poli = poli;
            existingPendaftaranBerobat.keluhan = keluhan;
            existingPendaftaranBerobat.namaDokter = namaDokter;
            existingPendaftaranBerobat.jam = jam;
            existingPendaftaranBerobat.jenisPembayaran = jenisPembayaran;
            existingPendaftaranBerobat.noTagihan = noTagihan;
            // existingPendaftaranBerobat.totalPembayaran = totalPembayaran;
            existingPendaftaranBerobat.fk = fk;

            this.em.persist(existingPendaftaranBerobat);
        }

        await this.em.flush();
    }

    async save(
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
        noTagihan: string,
        // totalPembayaran: string,
        fk: number,
    ): Promise<void> {
        // if (await this.exists(nik)) {
        //     throw new EntityExistsError(nik);
        // }

        const newPendaftaranBerobat = new PendaftaranBerobat(
            nik,
            nama,
            jenisKelamin,
            alamat,
            noTel,
            tanggalLahir,
            tanggalPengajuan,
            poli,
            keluhan,
            namaDokter,
            jam,
            jenisPembayaran,
            noTagihan,
            // totalPembayaran,
            fk,
        );
        this.create(newPendaftaranBerobat);
        await this.em.flush();
    }

    async flush(): Promise<void> {
        this.em.flush();
    }
}
