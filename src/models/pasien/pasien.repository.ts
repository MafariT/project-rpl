import { EntityRepository } from "@mikro-orm/mysql";
import { Pasien } from "./pasien.entity";
import z from "zod";

export class PasienRepository extends EntityRepository<Pasien> {
    static validFilter = z.enum(["nik"]);
    async fetch(filter?: string, value?: string): Promise<Pasien[]> {
        if (filter && value && PasienRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async saveOrUpdate(
        nik: string,
        nama: string,
        jenisKelamin: boolean,
        alamat: string,
        noTel: number,
        tanggalLahir: string,
        fotoProfil: string | null,
        fk: number,
    ): Promise<void> {
        const existingPasien = await this.findOne({ fk });

        if (existingPasien) {
            existingPasien.nik = nik;
            existingPasien.nama = nama;
            existingPasien.jenisKelamin = jenisKelamin;
            existingPasien.alamat = alamat;
            existingPasien.noTel = noTel;
            existingPasien.tanggalLahir = tanggalLahir;
            existingPasien.fotoProfil = fotoProfil;

            this.em.persist(existingPasien);
        } else {
            const newPasien = new Pasien(nik, nama,jenisKelamin, alamat, noTel, tanggalLahir, fotoProfil, fk);
            this.create(newPasien);
        }

        await this.em.flush();
    }
}
