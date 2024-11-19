import { EntityRepository } from "@mikro-orm/mysql";
import { PendaftaranBerobat } from "./pendaftaran-berobat.entity";
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

    async saveOrUpdate(
        nik: string,
        nama: string,
        jenisKelamin: string,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        tanggalPengajuan: string,
        poli: string,
        keluhan: string,
        namaDokter: string,
        jam: string,
        jenisPembayaran: string,
        totalPembayaran: string,
        fk: number,
    ): Promise<void> {
        const existingPePendaftaranBerobat = await this.findOne({ nik });

        if (existingPePendaftaranBerobat) {
            existingPePendaftaranBerobat.nik = nik;
            existingPePendaftaranBerobat.nama = nama;
            existingPePendaftaranBerobat.jenisKelamin = jenisKelamin;
            existingPePendaftaranBerobat.alamat = alamat;
            existingPePendaftaranBerobat.noTel = noTel;
            existingPePendaftaranBerobat.tanggalLahir = tanggalLahir;
            existingPePendaftaranBerobat.tanggalPengajuan = tanggalPengajuan;
            existingPePendaftaranBerobat.poli = poli;
            existingPePendaftaranBerobat.keluhan = keluhan;
            existingPePendaftaranBerobat.namaDokter = namaDokter;
            existingPePendaftaranBerobat.jam = jam;
            existingPePendaftaranBerobat.jenisPembayaran = jenisPembayaran;
            existingPePendaftaranBerobat.totalPembayaran = totalPembayaran;
            existingPePendaftaranBerobat.fk = fk;

            this.em.persist(existingPePendaftaranBerobat);
        } else {
            const newPePendaftaranBerobat = new PendaftaranBerobat(
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
                totalPembayaran,
                fk,
            );
            this.create(newPePendaftaranBerobat);
        }

        await this.em.flush();
    }
}
