import { EntityRepository } from "@mikro-orm/mysql";
import { Admin } from "./admin.entity";
import z from "zod";

export class AdminRepository extends EntityRepository<Admin> {
    static validFilter = z.enum(["nip"]);
    async fetch(filter?: string, value?: string): Promise<Admin[]> {
        if (filter && value && AdminRepository.validFilter.safeParse(filter).success) {
            return this.find({ [filter]: value });
        } else {
            return this.findAll({ limit: 100 });
        }
    }

    async saveOrUpdate(
        nip: string,
        nama: string,
        jenisKelamin: string,
        alamat: string,
        noTel: string,
        tanggalLahir: string,
        fotoProfil: string | null,
        fk: number,
    ): Promise<void> {
        const existingAdmin = await this.findOne({ fk });

        if (existingAdmin) {
            existingAdmin.nip = nip;
            existingAdmin.nama = nama;
            existingAdmin.jenisKelamin = jenisKelamin;
            existingAdmin.alamat = alamat;
            existingAdmin.noTel = noTel;
            existingAdmin.tanggalLahir = tanggalLahir;
            existingAdmin.fotoProfil = fotoProfil;

            this.em.persist(existingAdmin);
        } else {
            const newAdmin = new Admin(nip, nama, jenisKelamin, alamat, noTel, tanggalLahir, fotoProfil, fk);
            this.create(newAdmin);
        }

        await this.em.flush();
    }
}
